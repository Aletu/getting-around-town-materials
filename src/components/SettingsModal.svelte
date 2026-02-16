<script>
  import { createEventDispatcher } from 'svelte';
  import { themeStore, fontSizeStore, reducedMotionStore, dyslexiaFontStore } from '../stores.js';
  import { fade, scale } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') close();
  }

  const themes = [
    { id: 'gettingaround', name: 'Default' },
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' },
    { id: 'bumblebee', name: 'High Contrast' }
  ];

  const fontSizes = [
    { id: 'normal', name: 'Normal' },
    { id: 'large', name: 'Large' },
    { id: 'xlarge', name: 'Extra Large' }
  ];
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal modal-open z-[100]">
  <div class="modal-box relative max-w-md bg-base-100 shadow-2xl border border-base-200/50 rounded-2xl p-0 overflow-hidden" in:scale={{start: 0.95, duration: 200}} out:fade={{duration: 150}}>
    <!-- Header -->
    <div class="flex items-center justify-between p-5 border-b border-base-200">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-base-content">Settings</h3>
      </div>
      <button class="btn btn-sm btn-circle btn-ghost hover:bg-base-200" on:click={close} aria-label="Close settings">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
    
    <!-- Content -->
    <div class="p-5 space-y-6">
      <!-- Theme Section -->
      <div class="form-control w-full">
        <label class="label pb-1" for="theme-select">
          <span class="label-text font-semibold text-base-content">Theme</span>
        </label>
        <select id="theme-select" class="select select-bordered w-full focus:select-primary transition-all rounded-xl" bind:value={$themeStore}>
          {#each themes as theme}
            <option value={theme.id}>{theme.name}</option>
          {/each}
        </select>
      </div>

      <!-- Typography Section -->
      <div class="space-y-4 border-t pt-5 border-base-200">
        <h4 class="font-semibold text-xs uppercase tracking-wider text-base-content/50">Typography</h4>
        
        <div class="form-control w-full">
          <span class="label-text mb-2 block font-medium text-sm">Text Size</span>
          <div class="join w-full rounded-xl overflow-hidden" role="group" aria-label="Text Size Selection">
            {#each fontSizes as size}
              <button 
                class="join-item btn flex-1 font-medium" 
                class:btn-primary={$fontSizeStore === size.id}
                class:btn-ghost={$fontSizeStore !== size.id}
                on:click={() => $fontSizeStore = size.id}
                aria-pressed={$fontSizeStore === size.id}
              >
                {size.name}
              </button>
            {/each}
          </div>
        </div>

        <label class="flex items-start gap-4 p-3 rounded-xl hover:bg-base-200/50 transition-colors cursor-pointer -mx-1">
          <input type="checkbox" class="toggle toggle-primary mt-0.5" bind:checked={$dyslexiaFontStore} />
          <div class="flex-1">
            <span class="label-text font-medium block">Dyslexia Friendly Font</span>
            <p class="text-xs text-base-content/50 mt-0.5">Changes font to a more readable style.</p>
          </div>
        </label>
      </div>

      <!-- Motion Section -->
      <div class="space-y-4 border-t pt-5 border-base-200">
        <h4 class="font-semibold text-xs uppercase tracking-wider text-base-content/50">Accessibility</h4>
        
        <label class="flex items-start gap-4 p-3 rounded-xl hover:bg-base-200/50 transition-colors cursor-pointer -mx-1">
          <input type="checkbox" class="toggle toggle-primary mt-0.5" bind:checked={$reducedMotionStore} />
          <div class="flex-1">
            <span class="label-text font-medium block">Reduced Motion</span>
            <p class="text-xs text-base-content/50 mt-0.5">Disables animations and transitions.</p>
          </div>
        </label>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-5 pt-0">
      <button class="btn btn-primary w-full rounded-xl font-semibold shadow-sm hover:shadow-md transition-all" on:click={close}>Done</button>
    </div>
  </div>
  <div 
    class="modal-backdrop bg-base-content/40 backdrop-blur-sm" 
    on:click={close} 
    role="button" 
    tabindex="0" 
    on:keydown={(e) => e.key === 'Enter' && close()}
    aria-label="Close modal"
  ></div>
</div>
