<script lang="ts">
    import { goto } from "$app/navigation";
    import type { UserCreate } from "$lib/definitions";
    import { apiClient } from "$lib/utils";

    let user = $state<UserCreate>({
        firstname: '',
        lastname: '',
        username: '',
        password: ''
    });

    let showPassword = $state(false);  // State to toggle password visibility
    let errorMessage = $state<string | null>(null);

    async function handleSignup(event: SubmitEvent) {
        event.preventDefault();
        try {
            const response = await apiClient.post('/user/signup', { ...user });
            if (response.status === 200) {
                alert('Signup Success');
                console.log(response.data);
                goto("/");  // Redirect to the homepage after successful signup
            }
            else {
                alert('Error in signup');
            }
        } catch (error) {
            console.log(error);
        }
    }    
</script>

<div class="container">
    <!-- The box that holds the logo and the signup form -->
    <div class="form-container">
        <!-- Header: Welcome to CiviliTalk -->
        <h2 class="form-title">Welcome to CiviliTalk</h2>

        <div class="content">
            <!-- Left Side: Logo (GIF) -->
            <div class="gif-container">
                <img src="Civili.gif" alt="CiviliTalk" class="gif-image" />
            </div>

            <!-- Right Side: Signup Form -->
            <form class="form" onsubmit={handleSignup}>
                <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" class="grow" placeholder="First Name" bind:value={user.firstname} required />
                </label>

                <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" class="grow" placeholder="Last Name" bind:value={user.lastname} required />
                </label>

                <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" class="grow" placeholder="Username" bind:value={user.username} required />
                </label>

                <!-- Password with Minimum Length Validation -->
                <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
                        <path d="M4 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1H4V4Zm10 3H2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7ZM5.5 9a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0V9Zm4.5 0a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0V9Z" />
                    </svg>
                    <div class="relative w-full">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            class="grow" 
                            placeholder="Password" 
                            bind:value={user.password} 
                            required 
                            minlength="8" 
                            title="Password must be at least 8 characters long" />
                        <button 
                            type="button" 
                            class="absolute inset-y-0 right-3 text-sm text-blue-600 hover:underline"
                            onclick={() => showPassword = !showPassword}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </label>

                <input type="submit" value="Signup" class="btn btn-neutral" />
            </form>
        </div>
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        width: 80%;
        max-width: 900px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }

    .form-title {
        font-size: 36px;
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
        margin-bottom: 20px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .gif-container {
        flex: 1;
        display: flex;
        justify-content: center;
    }

    .gif-image {
        max-width: 100%;
        height: auto;
        border-radius: 10px;
    }

    .form {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-width: 400px;
    }

    .input {
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-bottom: 15px;
    }

    .btn-neutral {
        background-color: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        width: 100%;
        cursor: pointer;
        font-size: 16px;
    }

    .btn-neutral:hover {
        background-color: #45a049;
    }
</style>
