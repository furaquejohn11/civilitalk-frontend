<script lang="ts">
  import { type ChatguardPrompt, ChatguardCommand, type Conversation, type UserRead, type Message, BotModel } from "$lib/definitions";
  import { formatDate, apiClient, isChatguardCommand, hasChatguard, executeChatguard, getChatguardModel, executeChatguardModel, executeChatguardUtils } from "$lib/utils";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { reloadInboxContent } from "$lib/stores";
	import { get } from "svelte/store";

  let socket: WebSocket;
  let newMessage = $state('');
  let displayName = $state('');
  let messages = $state<Conversation[]>([]);
  let isLoading = $state(false);

  let userId = $state(1);
  let inboxId = $state<number>();
  let userFullName = $state('');
  const inboxParams = $derived($page.params.convo_id);
  const currentPage = 1;


  
  function initializeSocket() {
      socket = new WebSocket(`ws://localhost:8000/ws/chat?inbox_id=${inboxId}`);

      socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          messages = [...messages, { ...message, created_at: new Date(message.created_at) }];
          handleInboxReload();
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
  }

  function handleInboxReload() {
    const { reloadInbox } = get(reloadInboxContent);
    if (reloadInbox) {
        reloadInbox();
    }
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
      userFullName = `${user.firstname} ${user.lastname}`;
      
    }

    try {
      inboxId = parseInt(inboxParams);
    } catch (error) {
      alert('Invalid Conversation');
      goto('/inbox')
    }
    
    fetchMessages();
  }
  async function fetchMessages() {
      
      isLoading = true;
      try {
          const response = await apiClient.get(`/conversation/${inboxId}`, {
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
      } finally {
          isLoading = false;
          scrollToBottom();
      }
  };

  function responseSender(message: ChatguardPrompt) {
    if (message) {
      const prompt: ChatguardPrompt = {...message};
      socket.send(JSON.stringify(prompt));
    }
    else {
      alert('Invalid message!');
    }
  }

  async function initiateChatguard(message: string) {
    if (!inboxId) {
      return;
    }

    switch (message) {
      // List of all commands. Check ChatguardCommand enum in the definition if you want to add 
      // additional commands.
      case "/chatguard-on":
        const response_on = await executeChatguard(inboxId, userFullName, ChatguardCommand.enable);
        responseSender(response_on);
        break;

      case "/chatguard-off":
        const response_off = await executeChatguard(inboxId, userFullName, ChatguardCommand.disable);
        responseSender(response_off);
        break;

      case "/chatguard-help":
        const response_help = await executeChatguardUtils(inboxId, ChatguardCommand.help);
        responseSender(response_help);
        break;

      case "/chatguard-status":
        const response_status = await executeChatguardUtils(inboxId, ChatguardCommand.status);
        responseSender(response_status);
        break;

      case "/chatguard-rnn":
        const response_rnn = await executeChatguardModel(inboxId, userFullName, BotModel.RNN);
        responseSender(response_rnn);
        break;

      case "/chatguard-rf":
        const response_rf = await executeChatguardModel(inboxId, userFullName, BotModel.RANDOM_FOREST);
        responseSender(response_rf);
        break;

      default:
        alert("Chatguard commands must not have any preceding arguments.");
        break;
    }
  }

  async function sendMessage() {
      if (newMessage.trim() === "" || !inboxId) return;

      const chatguard = await hasChatguard(inboxId);
      const botModel = await getChatguardModel(inboxId);
      const message: Message = {
          inbox_id: inboxId,
          sender_id: userId,
          text: newMessage,
          has_chatguard: chatguard,
          bot_model: botModel
      };

      // Send the message through WebSocket
      socket.send(JSON.stringify(message));

      if (isChatguardCommand(newMessage)) await initiateChatguard(newMessage);
      
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
    handleIdentity();
    initializeSocket();
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
    </header>
  
    <!-- Messages Section -->
    <section class="flex-1 overflow-y-auto p-4 chat-container bg-base-100 rounded-md shadow-md">
      {#if isLoading}
        <div class="flex justify-center items-center h-full">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      {:else}
        {#each messages as msg (msg.id)}
          {#if msg.sender_id === userId}
            <!-- User's Message -->
            <div class="chat chat-end">
              <div class="chat-bubble chat-bubble-primary">{msg.text}</div>
              <div class="chat-footer opacity-50 text-xs">{formatDate(msg.created_at)}</div>
            </div>
          {:else if (msg.sender_id === 0)}
          <!-- Recipient's Message -->
          <div class="chat chat-start flex items-start gap-2">
            <div class="avatar">
              <div class="w-10 h-10 rounded-full ring ring-gray-600">
                <img 
                  src="https://api.dicebear.com/6.x/bottts/svg?seed=ChatBot"
                  alt="Chatguard Avatar" 
                />
              </div>
            </div>
            <div>
              <div class="chat-bubble chat-bubble-accent whitespace-pre-line">{msg.text}</div>
              <div class="chat-footer opacity-50 text-xs">{formatDate(msg.created_at)}</div>
            </div>
          </div>
          {:else}
            <!-- Recipient's Message -->
            <div class="chat chat-start flex items-start gap-2">
              <div class="avatar">
                <div class="w-10 h-10 rounded-full ring ring-gray-600">
                  <img 
                    src={`https://api.dicebear.com/6.x/micah/svg?seed=${displayName}`}
                    alt="User Avatar" 
                  />
                </div>
              </div>
              <div>
                <div class="chat-bubble chat-bubble-accent">{msg.text}</div>
                <div class="chat-footer opacity-50 text-xs">{formatDate(msg.created_at)}</div>
              </div>
            </div>
          {/if}
        {/each}
      {/if}
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
  