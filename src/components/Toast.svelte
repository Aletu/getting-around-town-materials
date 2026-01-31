<script>
  import { toastStore } from '../stores.js';
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  function remove(id) {
    toastStore.remove(id);
  }
</script>

<div class="toast toast-bottom toast-end z-[100] p-4">
  {#each $toastStore as toast (toast.id)}
    <button 
      type="button"
      class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-soft cursor-pointer hover:scale-[1.02] transition-all text-left backdrop-blur-sm border
        {toast.type === 'info' ? 'bg-info border-info text-info-content' : ''}
        {toast.type === 'success' ? 'bg-success border-success text-success-content' : ''}
        {toast.type === 'warning' ? 'bg-warning border-warning text-warning-content' : ''}
        {toast.type === 'error' ? 'bg-error border-error text-error-content' : ''}"
      animate:flip
      in:fly={{ y: 20, duration: 300 }}
      out:fly={{ x: 20, duration: 300 }}
      on:click={() => remove(toast.id)}
      aria-label="Dismiss notification: {toast.message}"
    >
      <div class="flex-shrink-0">
        {#if toast.type === 'success'}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {:else if toast.type === 'error'}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {:else if toast.type === 'warning'}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {/if}
      </div>
      <span class="text-sm font-medium">{toast.message}</span>
    </button>
  {/each}
</div>
