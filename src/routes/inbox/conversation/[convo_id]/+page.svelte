<script lang="ts">
  import { onMount } from "svelte";
  import type { Conversation, UserRead } from "$lib/definitions";
  import { formatDate, apiClient } from "$lib/utils";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let socket: WebSocket;
  let newMessage = $state('');
  let displayName = $state('');
  let messages = $state<Conversation[]>([]);

  let userId = $state(1);
  let convoId = $state<number>();
  const convoParams = $derived($page.params.convo_id);
  const currentPage = 1;

  
  function initializeSocket() {
      socket = new WebSocket("ws://localhost:8000/ws/chat");

      socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          messages = [...messages, { ...message, created_at: new Date(message.created_at) }];
          scrollToBottom();
      };

      socket.onopen = () => {
          console.log("WebSocket connection established");
      };

      socket.onclose = () => {
          console.log("WebSocket connection closed");
      };

      handleIdentity();

      return () => {
          socket.close();
      };
  }
  
  function handleIdentity() {
    if (browser) {
      const userData = localStorage.getItem('user');
      if (!userData) {
          goto('/login');
          return
      }
      const user: UserRead = JSON.parse(userData);
      userId = user.id;

      
    }

    try {
      convoId = parseInt(convoParams);
    } catch (error) {
      alert('Invalid Conversation');
      goto('/inbox')
    }
    
    fetchMessages();
  }
  async function fetchMessages() {
      try {
          const response = await apiClient.get(`/conversation/${convoId}`, {
          params: { page: currentPage },
          });

          // Check if the data is an array directly
          if (response.data && Array.isArray(response.data)) {
          // Map and convert created_at to Date
          messages = response.data.map((msg: Conversation) => ({
              ...msg,
              created_at: new Date(msg.created_at), // Convert created_at string to Date
          }));
          } else {
          console.error("Invalid response structure", response);
          }
      } catch (error) {
          console.error("Error fetching messages:", error);
      }

      scrollToBottom();
  };

  function sendMessage() {
      if (newMessage.trim() === "") return;

      const message = {
          inbox_id: convoId,
          sender_id: userId,
          text: newMessage,
          has_chatguard: true, // Set this based on your application logic
      };

      // Send the message through WebSocket
      socket.send(JSON.stringify(message));
      newMessage = '';
      scrollToBottom();
  };

  function scrollToBottom() {
      setTimeout(() => {
          const chatContainer = document.querySelector('.chat-container');
          if (chatContainer) {
              chatContainer.scrollTop = chatContainer.scrollHeight;
          }
      }, 0);
  };

  $effect(() => {
    resetConversation();
    initializeSocket();
    handleIdentity();
  });

  function resetConversation() {
      if (socket) {
          socket.close();
      }

      messages = [];
      newMessage = ''
      if (browser) {
        const userData = localStorage.getItem('user');
        if (!userData) {
            goto('/login');
            return
      }
      const user: UserRead = JSON.parse(userData);
      userId = user.id;

      displayName = $page.url.searchParams.get('displayName') || '';
    }
  }

</script>
  
  <main class="min-h-screen flex flex-col bg-base-200 p-4 w-full">
    <!-- Chat Header -->
    <header class="flex items-center justify-between bg-neutral text-white p-4 mb-4 rounded-lg shadow-lg">
      <div class="flex items-center gap-4">
        <div class="avatar">
          <div class="w-12 h-12 rounded-full ring ring-gray-600">
            <img 
              src= {`https://api.dicebear.com/6.x/micah/svg?seed=${displayName}`}
              alt="User Avatar" 
            />
          </div>
        </div>
        <div>
          <h1 class="text-lg font-semibold">{displayName}</h1>
          <p class="text-sm text-gray-400">Active now</p>
        </div>
      </div> 
      
      <!-- Alternative for logging in -->
      <!-- <input
        type="text"
        bind:value={convoInput}
        class=" text-black w-16"
        placeholder="ConvoId"
        onkeydown={(e) => e.key === 'Enter' && fetchMessages()}
      />
      <input
        type="text"
        bind:value={userInput}
        class=" text-black w-16"
        placeholder="UserId"
        onkeydown={(e) => e.key === 'Enter' && fetchMessages()}
      />
      <button onclick={handleIdentity}>
        Go
      </button> -->
    </header>
  
    <!-- Messages Section -->
    <section class="flex-1 overflow-y-auto p-4 chat-container bg-base-100 rounded-md shadow-md">
      {#each messages as msg (msg.id)}
        {#if msg.sender_id === userId}
          <!-- User's Message -->
          <div class="chat chat-end">
            <div class="chat-bubble chat-bubble-primary">{msg.text}</div>
            <div class="chat-footer opacity-50 text-xs">{formatDate(msg.created_at)}</div>
          </div>
        {:else}
          <!-- Recipient's Message -->
          <div class="chat chat-start">
            <div class="chat-bubble chat-bubble-accent">{msg.text}</div>
            <div class="chat-footer opacity-50 text-xs">{formatDate(msg.created_at)}</div>
          </div>
        {/if}
      {/each}
    </section>
  
    <!-- Message Input Section -->
    <footer class="mt-4 bg-white p-4 rounded-md shadow-md flex items-center gap-2">
      <input
        type="text"
        bind:value={newMessage}
        placeholder="Type a message..."
        class="input input-bordered flex-1"
        onkeydown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button class="btn btn-primary" onclick={sendMessage}>Send</button>
    </footer>
  </main>
  