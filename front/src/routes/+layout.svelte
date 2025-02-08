<!-- Layout principal -->
<script lang="ts">
  import '../app.css';
  import { Toaster } from 'svelte-french-toast';
</script>

<Toaster />

<div class="h-full">
  <slot />
</div> 