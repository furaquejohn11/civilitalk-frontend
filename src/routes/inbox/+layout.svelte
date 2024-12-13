<script lang="ts">
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import type { MessagePreview, UserRead, InboxPreview } from "$lib/definitions";
    import { apiClient, formatDate } from "$lib/utils";
    import { page } from "$app/stores";


    let firstName = $state('');
    let loading = $state(true);
    let searchQuery = $state('');
    let isDropdownOpen = $state(false);
    let isMobile = $state(false);
    let user_inbox = $state<InboxPreview[]>([]);
    let {children} = $props()

    // Check if the current route is a specific conversation
    let isConversationOpen = $derived($page.url.pathname.startsWith('/inbox/conversation') || 
                             $page.url.pathname === '/inbox/new');

    let isBaseInboxRoute = $derived($page.url.pathname === '/inbox');

    onMount(() => {
        if (browser) {
            // Check for mobile view
            const checkMobile = () => {
                isMobile = window.innerWidth < 768; // Tailwind's md breakpoint
            };
            
            checkMobile();
            window.addEventListener('resize', checkMobile);

            const initializeConversations = async () => {
                try {
                    
                    const userData = localStorage.getItem('user');
                    if (!userData) {
                        await goto('/login');
                        return
                    }

                    const user: UserRead = JSON.parse(userData);
                    firstName = user.firstname;
                    await loadConversations(user.id);
                    loading = false;
                } catch (error) {
                    console.error("Error loading conversations:", error);
                    await goto('/login');
                }
            };

            initializeConversations();

            // Return cleanup function
            return () => {
                window.removeEventListener('resize', checkMobile);
            };
        }
    });

    async function loadConversations(user_id: number) {
        try {
            const response = await apiClient.get('/inbox/user', {params: {user_id: user_id}})
            user_inbox = response.data as InboxPreview[];
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        }
    }

    function handleLogout() {
        localStorage.clear();
        goto('/login');
    }

    function handleProfile() {
        goto('/profile');
    }

    function handleNewConversation() {
        goto('/inbox/new');
    }

    function filteredConversations() {
        return searchQuery
            ? user_inbox.filter((inbox) =>
                  inbox.display_name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : user_inbox;
    }
</script>

<main class="flex h-screen bg-gray-50">
    <!-- Sidebar for Mobile: Show only when no conversation is open or not in mobile view -->
    {#if !isMobile || (!isConversationOpen && isMobile)}
        <aside class="w-full md:w-1/3 lg:w-1/4 bg-white shadow-lg block md:block">
            <div class="p-6 space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold">Messages</h1>
                    <div class="relative">
                        <!-- Settings Button -->
                        <button
                            class="btn btn-square btn-outline btn-sm"
                            aria-label="Settings"
                            onclick={() => (isDropdownOpen = !isDropdownOpen)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                class="w-5 h-5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.757.426 1.757 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.757-2.924 1.757-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.757-.426-1.757-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </button>
                        <button
                            onclick={handleNewConversation}
                            class="btn btn-square btn-outline btn-sm"
                            aria-label="New Conversation"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                class="w-5 h-5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>

                        <!-- Dropdown Menu -->
                        {#if isDropdownOpen}
                            <div 
                                class="absolute top-full right-0 mt-2 w-44 bg-white shadow-lg rounded-lg py-2 z-10"
                            >
                                <button
                                    class="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    onclick={handleProfile}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Profile
                                </button>
                                <button
                                    class="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    onclick={handleLogout}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Search -->
                <div class="relative">
                    <input
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Search messages..."
                        class="input input-bordered w-full pl-10"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <!-- Conversation List -->
                <div class="space-y-2">
                    {#if loading}
                        <div class="flex justify-center">
                            <span class="loading loading-spinner loading-lg"></span>
                        </div>
                    {:else if filteredConversations().length > 0}
                        {#each filteredConversations() as inbox}
                            <button
                                onclick={() => goto(`/inbox/conversation/${inbox.id}?displayName=${encodeURIComponent(inbox.display_name)}`)}
                                class="flex items-center p-4 w-full rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                            >
                                <div class="relative">
                                    <div class="avatar online">
                                        <div class="w-12 h-12 rounded-full">
                                            <img
                                                src={`https://api.dicebear.com/6.x/micah/svg?seed=${inbox.display_name}`}
                                                alt={inbox.display_name}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="ml-4 flex-grow max-w-xs">
                                    <div class="flex justify-between items-center">
                                        <h2 class="font-semibold text-sm">{inbox.display_name}</h2>
                                        <h2 class="font-semibold text-sm">{formatDate(new Date(inbox.message_date))}</h2>
                                    </div>
                                    <p class="text-sm text-gray-500 text-left truncate">{inbox.last_message}</p>
                                </div>
                            </button>
                        {/each}
                    {:else}
                        <p class="text-gray-500 text-center">No messages found.</p>
                    {/if}
                </div>
            </div>
        </aside>
    {/if}

    <!-- Render Part: Only visible if there's a conversation open or not on mobile -->
    {#if isConversationOpen || !isMobile}
        {@render children()}
    {/if}
</main>

<style>
    .avatar.online .rounded-full {
        position: relative;
    }
</style>
