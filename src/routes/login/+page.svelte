<script lang="ts">
  import { apiClient } from "$lib/utils";
	import type { UserLogin, UserRead } from "$lib/definitions";
	import { goto } from "$app/navigation";

  let user = $state<UserLogin>({username: '', password: ''});
  let errorMessage = $state<string | null>(null);
  let showPassword = $state(false);

  async function handleLogin(event: SubmitEvent){
      event.preventDefault();
      try {
          const response = await apiClient.post<UserRead>('/user/login', {...user});
          if (response.status === 200) {
              alert('Login Success');
              console.log(response.data)

              // Dont do this in real production. This is only for simple storing information.
              localStorage.setItem('user', JSON.stringify(response.data));
              goto('/inbox');
          }
          else {
              alert('Mali code mo');
          }
      } catch (error) {
          alert(error);
      }
      
  }
</script>
<main class="flex items-center justify-center min-h-screen">
    <form class="flex flex-col gap-4" onsubmit={handleLogin}>
      <label class="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70">
          <path
            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input
          type="text"
          class="grow"
          placeholder="Username"
          bind:value={user.username}
          required
        />
      </label>
  
      <label class="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70">
          <path
            fill-rule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clip-rule="evenodd" />
        </svg>
        <input
          type={showPassword ? "text" : "password"}
          class="grow"
          placeholder="Password"
          bind:value={user.password}
          required
        />
        <button 
          class="w-7 -ml-14"
          type="button"
          onclick={() => showPassword = !showPassword}>
          {showPassword ? "Hide" : "Show"}
        </button>
      </label>
  
      <input type="submit" value="Login" class="btn btn-neutral" />
      {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
      {/if}
    </form>
  </main>