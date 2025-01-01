<script lang="ts">
  import { apiClient } from "$lib/utils";
  import type { UserLogin, UserRead } from "$lib/definitions";
  import { goto } from "$app/navigation";

  let user = $state<UserLogin>({ username: '', password: '' });
  let errorMessage = $state<string | null>(null);
  let showPassword = $state(false);

  async function handleLogin(event: SubmitEvent) {
    event.preventDefault();
    try {
      const response = await apiClient.post<UserRead>('/user/login', { ...user });
      if (response.status === 200) {
        alert('Login Success');
        console.log(response.data);

        // Simple storage for demonstration purposes only
        localStorage.setItem('user', JSON.stringify(response.data));
        goto('/inbox');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert(error);
    }
  }
</script>

<main class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
  <h1 class="text-4xl font-bold mb-8 mt-4">Welcome to CiviliTalk</h1>
  <div class="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
    <!-- Left Side: Civili.gif -->
    <div class="w-1/2 bg-gray-100 flex items-center justify-center">
      <img src="Civili.gif" alt="CiviliTalk Logo" class="h-80 w-80 object-contain" style="animation: none;" />
    </div>

    <!-- Right Side: Login Form -->
    <div class="w-1/2 p-8 flex flex-col justify-center">
      <form class="flex flex-col gap-4" onsubmit={handleLogin}>
        <label class="flex flex-col gap-2">
          <span class="text-sm font-semibold text-gray-600">Username</span>
          <input
            type="text"
            class="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your username"
            bind:value={user.username}
            required
          />
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-sm font-semibold text-gray-600">Password</span>
          <div class="relative">
            <input
              type={showPassword ? "text" : "password"}
              class="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              bind:value={user.password}
              required
            />
            <button 
              class="absolute inset-y-0 right-3 text-sm text-blue-600 hover:underline"
              type="button"
              onclick={() => showPassword = !showPassword}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <input type="submit" value="Login" class="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200" />
        {#if errorMessage}
          <p class="text-red-500 text-center mt-2">{errorMessage}</p>
        {/if}
      </form>
    </div>
  </div>
</main>

<style>
  main {
    font-family: Arial, sans-serif;
  }

  @keyframes gif-animation {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.1);
    }
  }

  img[src$="Civili.gif"] {
    animation: gif-animation 1s infinite alternate;
  }
</style>
