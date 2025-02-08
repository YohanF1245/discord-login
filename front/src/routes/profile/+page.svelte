<!-- Page de profil -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import toast from 'svelte-french-toast';
  import axios, { AxiosError } from 'axios';
  import type { UserProfile, Promotion } from '$lib/types';
  import { DISCORD_ME_URL, USER_PROFILE_URL, PROMOTIONS_URL } from '$lib/config';

  let user: UserProfile | null = null;
  let loading = true;
  let promotions: Promotion[] = [];
  let editMode = false;

  let formData = {
    firstName: '',
    lastName: '',
    email: '',
    promotionUuid: ''
  };

  async function loadPromotions() {
    try {
      const response = await axios.get<Promotion[]>(PROMOTIONS_URL);
      promotions = response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des promotions:', error);
    }
  }

  async function loadUserProfile() {
    const token = new URLSearchParams(window.location.search).get('token') || 
                 localStorage.getItem('discord_token');
    
    if (!token) {
      window.location.href = '/';
      return;
    }

    try {
      const response = await axios.get<UserProfile>(DISCORD_ME_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      user = response.data;
      
      if (token === new URLSearchParams(window.location.search).get('token')) {
        localStorage.setItem('discord_token', token);
      }

      if (user.userInfo) {
        formData = {
          firstName: user.userInfo.firstName,
          lastName: user.userInfo.lastName,
          email: user.userInfo.email,
          promotionUuid: user.userInfo.promotionUuid || ''
        };
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Erreur lors de la récupération du profil');
        localStorage.removeItem('discord_token');
        window.location.href = '/';
      }
    } finally {
      loading = false;
    }
  }

  async function saveProfile() {
    try {
      const token = localStorage.getItem('discord_token');
      if (!token || !user) return;

      await axios.post(USER_PROFILE_URL, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Profil mis à jour avec succès');
      editMode = false;
      await loadUserProfile();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde du profil');
      }
    }
  }

  onMount(async () => {
    if (browser) {
      await Promise.all([loadUserProfile(), loadPromotions()]);
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
  <div class="container mx-auto p-4 space-y-8 max-w-2xl">
    <div class="card p-6">
      <div class="flex items-center space-x-4 mb-6">
        {#if user.avatar}
          <img
            src="https://cdn.discordapp.com/avatars/{user.snowflake}/{user.avatar}.png"
            alt="Avatar"
            class="w-16 h-16 rounded-full"
          />
        {:else}
          <div class="w-16 h-16 rounded-full bg-surface-300 flex items-center justify-center">
            <span class="text-2xl">{user.discordUsername[0]}</span>
          </div>
        {/if}
        <div>
          <h2 class="h2">{user.discordUsername}</h2>
          {#if user.global_name}
            <p class="text-sm opacity-70">{user.global_name}</p>
          {/if}
        </div>
      </div>

      {#if editMode}
        <form class="space-y-4" on:submit|preventDefault={saveProfile}>
          <label class="label">
            <span>Prénom</span>
            <input
              type="text"
              class="input"
              bind:value={formData.firstName}
              required
            />
          </label>

          <label class="label">
            <span>Nom</span>
            <input
              type="text"
              class="input"
              bind:value={formData.lastName}
              required
            />
          </label>

          <label class="label">
            <span>Email</span>
            <input
              type="email"
              class="input"
              bind:value={formData.email}
              required
            />
          </label>

          <label class="label">
            <span>Promotion</span>
            <select class="select" bind:value={formData.promotionUuid}>
              <option value="">Sélectionnez une promotion</option>
              {#each promotions as promotion}
                <option value={promotion.uuid}>{promotion.name}</option>
              {/each}
            </select>
          </label>

          <div class="flex justify-end space-x-2">
            <button type="button" class="btn variant-soft" on:click={() => editMode = false}>
              Annuler
            </button>
            <button type="submit" class="btn variant-filled-primary">
              Enregistrer
            </button>
          </div>
        </form>
      {:else}
        <div class="space-y-4">
          {#if user.userInfo}
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="font-bold">Prénom</p>
                <p>{user.userInfo.firstName}</p>
              </div>
              <div>
                <p class="font-bold">Nom</p>
                <p>{user.userInfo.lastName}</p>
              </div>
              <div>
                <p class="font-bold">Email</p>
                <p>{user.userInfo.email}</p>
              </div>
              <div>
                <p class="font-bold">Promotion</p>
                <p>
                  {promotions.find(p => p.uuid === user.userInfo?.promotionUuid)?.name || 'Non définie'}
                </p>
              </div>
              <div>
                <p class="font-bold">Statut</p>
                <p>
                  {user.userInfo.isVerified ? 'Vérifié' : 'En attente de validation'}
                </p>
              </div>
            </div>
          {:else}
            <p class="text-center text-surface-600">
              Complétez votre profil pour accéder à toutes les fonctionnalités
            </p>
          {/if}

          <div class="flex justify-end space-x-2">
            <button class="btn variant-filled-primary" on:click={() => editMode = true}>
              {user.userInfo ? 'Modifier' : 'Compléter le profil'}
            </button>
            <button class="btn variant-filled-error" on:click={logout}>
              Se déconnecter
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if} 