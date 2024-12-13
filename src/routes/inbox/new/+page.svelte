<script lang="ts">
    import { apiClient, hasExistingInbox } from "$lib/utils";
    import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import type { UserRead } from "$lib/definitions";

    let userId = $state(0);
    let userFullName = $state('');
    // let receiverIdFullName = $state('');
    
    let searchQuery = $state("");
    let searchResults = $state<Array<{id: number, username: string; firstname: string; lastname: string }>>([]);
    let displayName = $state("");

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

    async function initiateInboxCreation(receiverId: number, fullname: string) {
        alert(receiverId);
        
        const {exists, inbox_id} = await hasExistingInbox(userId, receiverId);

        if (exists) {
            goto(`/inbox/conversation/${inbox_id}?displayName=${encodeURIComponent(fullname)}`)
        }
        else {
            alert('No conversation yet');
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
                        src={`https://api.dicebear.com/6.x/micah/svg?seed=${displayName}`}
                        alt="User Avatar" 
                    />
                </div>
            </div>
            <div>
                <h1 class="text-lg font-semibold">{displayName || "Guest"}</h1>
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
                            <p class="text-sm text-gray-500">{user.id}</p>
                        </button>
                    {/each}
                </ul>
            {/if}
        </div>
    </header>

    <!-- Messages Section -->
    <section class="flex-1 overflow-y-auto p-4 chat-container bg-base-100 rounded-md shadow-md">
        <p class="text-center text-gray-500">Messages will be displayed here</p>
    </section>

    <!-- Footer -->
    <footer class="mt-4 bg-white p-4 rounded-md shadow-md flex items-center gap-2">
        <input
            type="text"
            placeholder="Type a message..."
            class="input input-bordered flex-1"
        />
        <button class="btn btn-primary">Send</button>
    </footer>
</main>