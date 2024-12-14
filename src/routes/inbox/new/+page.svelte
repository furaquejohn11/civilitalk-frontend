<script lang="ts">
    import { apiClient, hasExistingInbox } from "$lib/utils";
    import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import type {UserRead, InboxCreate, Inbox, Conversation, Message } from "$lib/definitions";
	import { get } from "svelte/store";
	import { reloadInboxContent } from "$lib/stores";

    let userId = $state<number | null>();
    let userFullName = $state('');
    
    let searchQuery = $state("");
    let searchResults = $state<Array<{id: number, username: string; firstname: string; lastname: string }>>([]);

    let receiverFullName = $state("");
    let receiverId = $state<number | null>(null);

    let newMessage = $state("");
    let messages = $state<Conversation[]>([]);

    function handleIdentity() {
        if (browser) {
            const userData = localStorage.getItem('user');
        if (!userData) {
            goto('/login');
            return
        }
        const user: UserRead = JSON.parse(userData);
        userId = user.id;
        userFullName = `${user.firstname} ${user.lastname}`;
        
        }
    }

    async function initiateInboxCreation(receiver_id: number, fullname: string) {
        if (!userId) return;
        
        const {exists, inbox_id} = await hasExistingInbox(userId, receiver_id);

        if (exists) {
            goto(`/inbox/conversation/${inbox_id}?displayName=${encodeURIComponent(fullname)}`)
        }
        else {
            receiverFullName = fullname;
            receiverId = receiver_id;
        }
    }

    async function createInbox() {

        if (!userId)
        {
            alert('no userid');
            return;
        }
        if (!receiverId)
        {
            alert('no receiverid');
            return;
        }

        let inbox: InboxCreate = {
            created_by: userId,
            received_by: receiverId,
            has_chatguard: false
        };

        try {
            const response = await apiClient.post<Inbox>("/inbox/create", {...inbox});

            if (response) {
                const inboxId = response.data.id;

                const isSuccessMessage = await sendMessage(inboxId);
                if (isSuccessMessage) {
                    handleInboxReload();
                    goto(`/inbox/conversation/${inboxId}?displayName=${encodeURIComponent(receiverFullName)}`)
                }

                else {
                    alert('Wrong implementation in sending message');
                }
            }
            else {
                alert("Something's wrong. Try again later");
            }
        } catch (error) {
            alert(error);
        }
    }

    async function sendMessage(inboxId: number): Promise<boolean> {

        if (!userId) return false;

        const message: Message = {
          inbox_id: inboxId,
          sender_id: userId,
          text: newMessage,
          has_chatguard: false
        };

        try {
            const response = await apiClient.post<Conversation>('conversation/create', {...message});

            if (response) {
                messages.push(response.data);
                return true;
            }
            else {
                alert('Mali send message');
                return false
            }
        } catch (error) {
            alert(error);
            return false;
        }

    }

    function handleInboxReload() {
        const { reloadInbox } = get(reloadInboxContent);
        if (reloadInbox) {
            reloadInbox();
        }
    }
    
    $effect(() => {
        handleIdentity();
        async function fetchUsers() {
            if (searchQuery.trim() === "") {
                searchResults = [];
                return;
            }
            try {
                const response = await apiClient.get(`/user/${searchQuery}`);
                if (response.data) {
                    searchResults = Array.isArray(response.data) ? response.data : [response.data];
                } else {
                    searchResults = [];
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                searchResults = [];
            }
        }

        // Only fetch if search query is not empty
        if (searchQuery) {
            fetchUsers();
        }
    });
</script>

<main class="min-h-screen flex flex-col bg-base-200 p-4 w-full">
    <!-- Navbar -->
    <header class="flex items-center justify-between bg-neutral text-white p-4 mb-4 rounded-lg shadow-lg">
        <div class="flex items-center gap-4">
            <div class="avatar">
                <div class="w-12 h-12 rounded-full ring ring-gray-600">
                    <img 
                        src={`https://api.dicebear.com/6.x/micah/svg?seed=${receiverFullName}`}
                        alt="User Avatar" 
                    />
                </div>
            </div>
            <div>
                <h1 class="text-lg font-semibold">{receiverFullName || "Guest"}</h1>
                <p class="text-sm text-gray-400">Active now</p>
            </div>
        </div>
        <!-- Search Section -->
        <div class="relative w-full max-w-sm">
            <input 
                type="text" 
                bind:value={searchQuery} 
                class="input input-bordered w-full text-black" 
                placeholder="Search by username..."
            />
            {#if searchResults.length > 0}
                <ul class="absolute top-full text-black left-0 w-full bg-white border border-gray-200 shadow-md rounded-md mt-1 z-10">
                    {#each searchResults as user (user.username)}
                        <button class="p-2 hover:bg-gray-100 cursor-pointer text-left w-full"
                                onclick={() => initiateInboxCreation(user.id, `${user.firstname} ${user.lastname}`)}>
                            <p class="font-medium">{user.firstname} {user.lastname}</p>
                            <p class="font-sm">{user.username}</p>
                        </button>
                    {/each}
                </ul>
            {/if}
        </div>
    </header>

    <!-- Messages Section -->
    <section class="flex-1 overflow-y-auto p-4 chat-container bg-base-100 rounded-md shadow-md">
        <p class="text-center text-gray-500">Chatguard commands are only available after the first non-command messages.</p>
        {#each messages as msg}
                {#if msg.sender_id === userId}
                    <!-- User message -->
                    <div class="chat chat-end">
                        <div class="chat-bubble chat-bubble-primary">{msg.text}</div>
                    </div>
                {:else}
                    <!-- Recipient message -->
                    <div class="chat chat-start">
                        <div class="chat-bubble chat-bubble-accent">{msg.text}</div>
                    </div>
                {/if}
            {/each}
    </section>

    <!-- Footer -->
    <footer class="mt-4 bg-white p-4 rounded-md shadow-md flex items-center gap-2">
        <input
            type="text"
            bind:value={newMessage}
            placeholder="Type a message..."
            class="input input-bordered flex-1"
            disabled={receiverFullName === ""}
        />
        <button class="btn btn-primary" 
                disabled={receiverFullName === ""}
                onclick={createInbox}>
                Send</button>
    </footer>
</main>