<!-- Layout principal -->
<script lang="ts">
  import '../app.css';
  import { SvelteToast } from 'svelte-french-toast';
</script>

<SvelteToast />

<div class="h-full">
  <slot />
</div> 