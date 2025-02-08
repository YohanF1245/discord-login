<!-- Page de profil -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import toast from 'svelte-french-toast';
  import axios from 'axios';

  let user: any = null;
  let loading = true;

  onMount(async () => {
    if (browser) {
      const token = new URLSearchParams(window.location.search).get('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          user = response.data;
          localStorage.setItem('discord_token', token);
        } catch (error) {
          toast.error('Erreur lors de la récupération du profil');
          console.error(error);
        }
      } else {
        const savedToken = localStorage.getItem('discord_token');
        if (savedToken) {
          try {
            const response = await axios.get('http://localhost:3000/auth/me', {
              headers: {
                Authorization: `Bearer ${savedToken}`
              }
            });
            user = response.data;
          } catch (error) {
            localStorage.removeItem('discord_token');
            window.location.href = '/';
          }
        } else {
          window.location.href = '/';
        }
      }
      loading = false;
    }
  });

  const logout = () => {
    localStorage.removeItem('discord_token');
    window.location.href = '/';
  };
</script>

{#if loading}
  <div class="container h-full mx-auto flex justify-center items-center">
    <div class="card p-4">
      <p>Chargement...</p>
    </div>
  </div>
{:else if user}
  <div class="container h-full mx-auto flex justify-center items-center">
    <div class="card p-4 w-full max-w-lg">
      <h2 class="h2 mb-4">Profil Discord</h2>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <img
            src="https://cdn.discordapp.com/avatars/{user.snowflake}/{user.avatar}.png"
            alt="Avatar"
            class="w-16 h-16 rounded-full"
          />
          <div>
            <p class="font-bold">{user.discordUsername}</p>
            {#if user.global_name}
              <p class="text-sm opacity-70">{user.global_name}</p>
            {/if}
          </div>
        </div>
        <p>Snowflake: {user.snowflake}</p>
        <button class="btn variant-filled-error w-full" on:click={logout}>
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
{/if} 