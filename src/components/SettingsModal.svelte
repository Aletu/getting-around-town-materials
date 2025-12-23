<script>
  import { createEventDispatcher } from 'svelte';
  import { themeStore, fontSizeStore, reducedMotionStore, dyslexiaFontStore } from '../stores.js';
  import { fade, scale } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
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

<div class="modal modal-open z-[100]">
  <div class="modal-box relative max-w-md" in:scale={{start: 0.95, duration: 200}} out:fade={{duration: 150}}>
    <button class="btn btn-sm btn-circle absolute right-2 top-2" on:click={close}>✕</button>
    <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
      <span>⚙️</span> Settings
    </h3>

    <div class="space-y-6">
      <!-- Theme Section -->
      <div class="form-control w-full">
        <label class="label" for="theme-select">
          <span class="label-text font-semibold">Theme</span>
        </label>
        <select id="theme-select" class="select select-bordered w-full" bind:value={$themeStore}>
          {#each themes as theme}
            <option value={theme.id}>{theme.name}</option>
          {/each}
        </select>
      </div>

      <!-- Typography Section -->
      <div class="space-y-4 border-t pt-4 border-base-200">
        <h4 class="font-semibold text-sm uppercase tracking-wider text-base-content/70">Typography</h4>
        
        <div class="form-control w-full">
          <span class="label-text mb-2 block">Text Size</span>
          <div class="join w-full" role="group" aria-label="Text Size Selection">
            {#each fontSizes as size}
              <button 
                class="join-item btn flex-1" 
                class:btn-active={$fontSizeStore === size.id}
                on:click={() => $fontSizeStore = size.id}
                aria-pressed={$fontSizeStore === size.id}
              >
                {size.name}
              </button>
            {/each}
          </div>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <input type="checkbox" class="toggle toggle-primary" bind:checked={$dyslexiaFontStore} />
            <span class="label-text">Dyslexia Friendly Font</span> 
          </label>
          <p class="text-xs text-base-content/60 pl-14">Changes font to a more readable style.</p>
        </div>
      </div>

      <!-- Motion Section -->
      <div class="space-y-4 border-t pt-4 border-base-200">
        <h4 class="font-semibold text-sm uppercase tracking-wider text-base-content/70">Accessibility</h4>
        
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <input type="checkbox" class="toggle toggle-primary" bind:checked={$reducedMotionStore} />
            <span class="label-text">Reduced Motion</span> 
          </label>
          <p class="text-xs text-base-content/60 pl-14">Disables animations and transitions.</p>
        </div>
      </div>
    </div>

    <div class="modal-action mt-8">
      <button class="btn btn-primary w-full" on:click={close}>Done</button>
    </div>
  </div>
  <div 
    class="modal-backdrop bg-black/50" 
    on:click={close} 
    role="button" 
    tabindex="0" 
    on:keydown={(e) => e.key === 'Enter' && close()}
    aria-label="Close modal"
  ></div>
</div>
