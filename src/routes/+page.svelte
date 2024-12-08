<script lang="ts">
  import { onMount } from 'svelte';
  import type { InfoMessage } from '$lib/definitions';

  let data = $state<InfoMessage | null>(null);
  let error = $state<string | null>(null);

  onMount(async () => {
      // try {
      //     const response = await fetch('/api');
      //     if (!response.ok) {
      //         throw new Error('Network response was not ok');
      //     }
      //     data = await response.json();
      // } catch (e) {
      //     error = e instanceof Error ? e.message : 'An unexpected error occurred';
      // }

  });
</script>
<main class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">CiviliTalk</h1>
        <div class="space-x-4">
          <a href="/login" class="btn btn-outline">Login</a>
          <a href="/signup" class="btn btn-neutral">Sign Up</a>
        </div>
      </div>
    </header>
  
    <!-- Main Content -->
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to CiviliTalk
          </h2>
          <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Elevate your conversations with our AI-powered chat application
          </p>
        </div>
  
        <!-- Features -->
        <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div class="pt-6">
            <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <svg
                      class="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Smart Chatting</h3>
                <p class="mt-5 text-base text-gray-500">
                  Engage in meaningful conversations with our advanced chat interface.
                </p>
              </div>
            </div>
          </div>
  
          <div class="pt-6">
            <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <svg
                      class="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">AI-Powered Profanity Filter</h3>
                <p class="mt-5 text-base text-gray-500">
                  Our AI detects and filters out profanity, ensuring a respectful environment.
                </p>
              </div>
            </div>
          </div>
  
          <div class="pt-6">
            <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <svg
                      class="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Safe and Secure</h3>
                <p class="mt-5 text-base text-gray-500">
                  Enjoy peace of mind with our secure and private chat environment.
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Call to Action -->
        <div class="mt-16 text-center">
          <a href="/signup" class="btn btn-lg btn-neutral">Get Started</a>
        </div>
      </div>
    </main>
  
    <!-- Footer -->
    <footer class="bg-gray-50">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-base text-gray-400">
          © 2024 CiviliTalk. All rights reserved.
        </p>
      </div>
    </footer>
  </main>