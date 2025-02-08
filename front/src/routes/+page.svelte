<!-- Page d'accueil -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { DISCORD_AUTH_URL } from '$lib/config';
  
  const discordLogin = () => {
    if (browser) {
      window.location.href = DISCORD_AUTH_URL;
    }
  };
</script>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="card p-4 text-center">
    <h1 class="h1 mb-4">Discord OAuth2 Login</h1>
    <button class="btn variant-filled-primary" on:click={discordLogin}>
      Se connecter avec Discord
    </button>
  </div>
</div>
