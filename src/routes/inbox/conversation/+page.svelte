<script lang="ts">
  import { onMount } from "svelte";
  import type { Conversation } from "$lib/definitions";
  import { formatDate, apiClient } from "$lib/utils";

  let socket: WebSocket;
  let newMessage = $state('');
  let messages = $state<Conversation[]>([]);

  let userId = $state(1);
  let userInput = $state('');
  let convoId = $state(2);
  let convoInput = $state('')
  const currentPage = 1;

  onMount(() => {
      // Connect to WebSocket
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

      return () => {
          socket.close();
      };
  });
  const handleIdentity = () =>
  {
    convoId = parseInt(convoInput);
    fetchMessages();
  }
  const fetchMessages = async () => {
      userId = parseInt(userInput);
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
  };

  const sendMessage = () => {
      if (newMessage.trim() === "") return;

      const message = {
          inbox_id: convoId,
          sender_id: userId,
          text: newMessage,
          has_chatguard: true, // Set this based on your application logic
      };

      // Send the message through WebSocket
      socket.send(JSON.stringify(message));

      // Update the local message state (optimistic update)
      // messages = [
      //   ...messages,
      //   {
      //     id: Date.now(),
      //     inbox_id: 1,
      //     sender_id: userId,
      //     text: newMessage,
      //     created_at: new Date(),
      //   },
      // ];
      newMessage = '';
      scrollToBottom();
  };

  const scrollToBottom = () => {
      setTimeout(() => {
          const chatContainer = document.querySelector('.chat-container');
          if (chatContainer) {
              chatContainer.scrollTop = chatContainer.scrollHeight;
          }
      }, 0);
  };
</script>
  
  <main class="min-h-screen flex flex-col bg-base-200 p-4 w-full">
    <!-- Chat Header -->
    <header class="flex items-center justify-between bg-neutral text-white p-4 mb-4 rounded-lg shadow-lg">
      <div class="flex items-center gap-4">
        <div class="avatar">
          <div class="w-12 h-12 rounded-full ring ring-gray-600">
            <img 
              src="https://api.dicebear.com/6.x/initials/svg?seed=Alice&backgroundColor=000000&fontSize=50&bold=true" 
              alt="User Avatar" 
            />
          </div>
        </div>
        <div>
          <h1 class="text-lg font-semibold">Alice</h1>
          <p class="text-sm text-gray-400">Active now</p>
        </div>
      </div> 
      
      <!-- Alternative for logging in -->
      <input
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
      </button>
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
  