<script lang="ts">
	import type { UserCreate } from "$lib/definitions";
    import { apiClient } from "$lib/utils";

    let user = $state<UserCreate>({
        firstname: '',
        lastname: '',
        username: '',
        password: ''
    });
    
    async function handleSignup(event: SubmitEvent) {
        event.preventDefault();
        try {
            const response = await apiClient.post('/user/signup', {...user});
            if (response.status === 200) {
                alert('Signup Success');
                console.log(response.data)
            }
            else {
                alert('Mali code mo');
            }

        } catch (error) {
            console.log(error);
        }
    }    
</script>
  
<div class="flex items-center justify-center min-h-screen">
    <form class="flex flex-col gap-4" onsubmit={handleSignup}>
    <label class="input input-bordered flex items-center gap-2">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input 
            type="text" 
            class="grow" 
            placeholder="First Name"
            bind:value={user.firstname} 
            required
        />

    </label>

    <!-- Last Name -->
    <label class="input input-bordered flex items-center gap-2">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input 
            type="text" 
            class="grow" 
            placeholder="Last Name"
            bind:value={user.lastname} 
            required 
        />
    </label>

        <!-- Username -->
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

        <!-- Password -->
        <label class="input input-bordered flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="h-4 w-4 opacity-70">
                <path
                d="M4 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1H4V4Zm10 3H2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7ZM5.5 9a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0V9Zm4.5 0a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0V9Z" />
            </svg>
            <input 
                type="password" 
                class="grow" 
                placeholder="Password" 
                bind:value={user.password}
                required/>
        </label>

        <input 
            type="submit" 
            value="Signup" 
            class="btn btn-neutral" 
        />

    </form>
</div>