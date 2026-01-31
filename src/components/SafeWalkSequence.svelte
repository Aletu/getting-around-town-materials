<script>
  import { safeWalkStore, teacherMode } from '../stores.js';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { tick } from 'svelte';

  const dispatch = createEventDispatcher();
  
  // Track focused index for keyboard navigation
  let focusedIndex = -1;

  // Session state: we play through 3 distinct scenarios before the module is "fully" completed
  const SCENARIOS_PER_SESSION = 3;
  let sessionScenarios = [];
  let currentIndex = 0;
  let currentScenario;
  let items = [];
  let feedback = '';
  let completed = false; // true when the whole 3-scenario session is done
  let scenarioDone = false; // true when the current scenario has been correctly ordered
  let selectedId = null;

  function startNewSession() {
    // shuffle a shallow copy and take the first SCENARIOS_PER_SESSION
    const shuffled = [...$safeWalkStore].sort(() => Math.random() - 0.5);
    sessionScenarios = shuffled.slice(0, SCENARIOS_PER_SESSION);
    currentIndex = 0;
    completed = false;
    loadCurrentScenario();
  }

  // Re-init if store changes and we have no items (initial load)
  $: if ($safeWalkStore.length > 0 && sessionScenarios.length === 0) {
      startNewSession();
  }

  function loadCurrentScenario() {
    currentScenario = sessionScenarios[currentIndex];
    items = currentScenario.sequence.map(i => ({ ...i })).sort(() => Math.random() - 0.5);
    feedback = '';
    scenarioDone = false;
    selectedId = null;
  }

  // initialise first session
  // startNewSession(); // Removed, handled by reactive statement

  async function handleItemClick(id) {
    if (completed || scenarioDone) return;

    if (selectedId === null) {
      // Nothing is selected, so select this item.
      selectedId = id;
    } else if (selectedId === id) {
      // The same item was clicked, so deselect it.
      selectedId = null;
    } else {
      // A different item was already selected, so perform a swap.
      const sourceIndex = items.findIndex(i => i.id === selectedId);
      const targetIndex = items.findIndex(i => i.id === id);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        [items[sourceIndex], items[targetIndex]] = [items[targetIndex], items[sourceIndex]];
        items = [...items]; // Trigger reactivity for the animation.
      }

      // Wait for the DOM to update before resetting the selection
      await tick();
      
      // Reset selection and feedback after the swap.
      selectedId = null;
      feedback = '';
    }
  }

  // Keyboard navigation handler
  async function handleKeydown(event, index) {
    if (completed || scenarioDone) return;
    
    const id = items[index].id;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleItemClick(id);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        if (selectedId === id && index > 0) {
          // Move selected item up
          await swapItems(index, index - 1);
          focusedIndex = index - 1;
          await tick();
          focusItem(focusedIndex);
        } else {
          // Navigate to previous item
          focusedIndex = Math.max(0, index - 1);
          focusItem(focusedIndex);
        }
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        if (selectedId === id && index < items.length - 1) {
          // Move selected item down
          await swapItems(index, index + 1);
          focusedIndex = index + 1;
          await tick();
          focusItem(focusedIndex);
        } else {
          // Navigate to next item
          focusedIndex = Math.min(items.length - 1, index + 1);
          focusItem(focusedIndex);
        }
        break;
      case 'Escape':
        event.preventDefault();
        selectedId = null;
        break;
    }
  }

  async function swapItems(fromIndex, toIndex) {
    [items[fromIndex], items[toIndex]] = [items[toIndex], items[fromIndex]];
    items = [...items];
    await tick();
  }

  function focusItem(index) {
    /** @type {NodeListOf<HTMLElement>} */
    const buttons = document.querySelectorAll('[data-sequence-item]');
    if (buttons[index]) {
      buttons[index].focus();
    }
  }

  function checkOrder() {
    const isCorrect = items.every((it, idx) => it.correctIndex === idx);
    if (isCorrect) {
      feedback = '✅ Correct sequence!';
      scenarioDone = true;

      // small delay gives time to read feedback before switching automatically
      setTimeout(() => {
        if (currentIndex < SCENARIOS_PER_SESSION - 1) {
          currentIndex += 1;
          loadCurrentScenario();
        } else {
          completed = true;
        }
      }, 700);
    } else {
      feedback = '❌ Not yet. Try again.';
    }
  }
  function restart() {
    // restart a full 3-scenario session
    startNewSession();
  }

  // Teacher Mode Functions
  function addScenario() {
    $safeWalkStore = [...$safeWalkStore, {
        id: Date.now(),
        text: 'New Sequence Scenario',
        sequence: [
            { id: 'step1', label: 'Step 1', emoji: '1️⃣', correctIndex: 0, alt: 'Step 1' },
            { id: 'step2', label: 'Step 2', emoji: '2️⃣', correctIndex: 1, alt: 'Step 2' },
            { id: 'step3', label: 'Step 3', emoji: '3️⃣', correctIndex: 2, alt: 'Step 3' }
        ]
    }];
  }

  function deleteScenario(index) {
    const newScenarios = [...$safeWalkStore];
    newScenarios.splice(index, 1);
    $safeWalkStore = newScenarios;
  }
</script>

{#if $teacherMode}
  <div class="bg-base-100 rounded-2xl shadow-soft p-6 border border-base-200/50">
    <div class="flex items-center justify-between mb-6 pb-4 border-b border-base-200">
        <div class="flex items-center gap-3">
            <button class="btn btn-circle btn-ghost btn-sm hover:bg-base-200" on:click={() => dispatch('back')} aria-label="Go back">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 class="text-xl font-bold text-base-content">Sequence Editor</h2>
                <p class="text-sm text-base-content/60">Create ordering activities for safe walking.</p>
            </div>
        </div>
        <div class="badge badge-secondary">{$safeWalkStore.length} Sequences</div>
    </div>

    <div class="space-y-3">
        {#each $safeWalkStore as scenario, i}
        <div class="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-xl overflow-hidden">
            <input type="checkbox" /> 
            <div class="collapse-title font-medium flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                <span class="truncate flex-1 text-base-content/80">{scenario.text || 'New Sequence'}</span>
            </div>
            <div class="collapse-content bg-base-100 pt-4 border-t border-base-200"> 
                <div class="grid gap-4">
                    <div class="form-control w-full">
                        <span class="text-xs font-semibold uppercase text-base-content/50 mb-1.5">Scenario Description</span>
                        <textarea class="textarea textarea-bordered w-full h-24 rounded-xl bg-base-100 focus:border-secondary focus:ring-2 focus:ring-secondary/20" placeholder="Describe the situation..." bind:value={scenario.text} aria-label="Scenario description"></textarea>
                    </div>
                    
                    <div class="bg-base-200/30 p-4 rounded-xl border border-base-200">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-xs font-semibold uppercase text-base-content/50">Sequence Steps (Correct Order)</span>
                            <span class="text-xs text-base-content/50">Steps 1 to {scenario.sequence.length}</span>
                        </div>
                        
                        <div class="space-y-3">
                            {#each scenario.sequence as item, j}
                                <div class="flex items-start gap-3 bg-base-100 p-3 rounded-xl border border-base-200/50">
                                    <div class="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs flex items-center justify-center font-semibold mt-2">{j + 1}</div>
                                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                                        <div class="form-control">
                                            <span class="text-xs font-medium text-base-content/50 mb-1">Label</span>
                                            <input type="text" class="input input-sm input-bordered rounded-lg bg-base-100" placeholder="e.g. Stop" bind:value={item.label} aria-label="Step label" />
                                        </div>
                                        <div class="form-control">
                                            <span class="text-xs font-medium text-base-content/50 mb-1">Emoji</span>
                                            <input type="text" class="input input-sm input-bordered rounded-lg bg-base-100" placeholder="e.g. 🛑" bind:value={item.emoji} aria-label="Step emoji" />
                                        </div>
                                        <div class="form-control">
                                            <span class="text-xs font-medium text-base-content/50 mb-1">Alt Text</span>
                                            <input type="text" class="input input-sm input-bordered rounded-lg bg-base-100" placeholder="Description" bind:value={item.alt} aria-label="Step alt text" />
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button class="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-1.5" on:click={() => deleteScenario(i)}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete Sequence
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/each}
    </div>

    <button class="btn btn-secondary w-full mt-6 rounded-xl gap-2" on:click={addScenario}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        Add New Sequence
    </button>
  </div>
{:else}
<section class="space-y-6 max-w-3xl mx-auto" in:fade={{ duration: 300 }}>
  <div class="flex items-center gap-4">
    <button class="btn btn-circle btn-ghost bg-base-100 shadow-sm hover:shadow-md hover:bg-base-200 transition-all" on:click={() => dispatch('back')} aria-label="Go back">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
    </button>
    <div>
        <h2 class="text-xl lg:text-2xl font-bold text-base-content">Safe Walk Sequence</h2>
        <p class="text-sm text-base-content/60">Order the steps correctly.</p>
    </div>
  </div>

  {#if !completed}
    <div class="card bg-base-100 shadow-soft overflow-hidden border border-base-200/50">
      <!-- Progress Bar -->
      <div class="h-1 bg-base-200 w-full">
        <div class="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-500 ease-out" style="width: {((currentIndex + 1) / SCENARIOS_PER_SESSION) * 100}%"></div>
      </div>
      
      <div class="card-body p-5 sm:p-7 lg:p-8">
        <!-- Progress Indicator -->
        <div class="flex items-center justify-between text-sm mb-5">
          <span class="text-base-content/50 font-medium">Scenario {currentIndex + 1} of {SCENARIOS_PER_SESSION}</span>
        </div>
        
        <div class="bg-gradient-to-br from-base-200/60 to-base-200/30 p-5 sm:p-6 rounded-2xl border border-base-300/50 mb-6 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full"></div>
            <div class="pl-3">
              <h3 class="font-semibold text-xs uppercase text-secondary/70 mb-1.5 tracking-wide">Scenario:</h3>
              <p class="text-lg sm:text-xl font-medium leading-relaxed text-base-content">{currentScenario.text}</p>
            </div>
        </div>

        <p class="text-sm text-base-content/60 mb-3">💡 <strong>Tip:</strong> Click to select, then click another to swap. <kbd class="kbd kbd-xs">↑↓</kbd> to move selected item.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" role="listbox" aria-label="Reorder these steps into the correct sequence" aria-describedby="sequence-instructions">
          <span id="sequence-instructions" class="sr-only">Use arrow keys to move a selected item. Press Enter or Space to select an item, then use arrow keys to move it. Press Escape to deselect.</span>
          {#each items as item, index (item.id)}
            <button
              type="button"
              data-sequence-item
              class="group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer select-none touch-manipulation min-h-[7rem]
              {selectedId !== item.id ? 'bg-base-100 border-base-200/80 hover:border-secondary/50 hover:shadow-md' : ''}
              {selectedId === item.id ? 'bg-secondary text-secondary-content border-secondary ring-4 ring-secondary/20' : ''}"
              on:click={() => handleItemClick(item.id)}
              on:keydown={(e) => handleKeydown(e, index)}
              aria-label="{item.label || item.alt}. Position {index + 1} of {items.length}. {selectedId === item.id ? 'Selected. Use arrow keys to move.' : 'Press Enter to select.'}"
              role="option"
              aria-selected={selectedId === item.id}
              animate:flip={{ duration: 300 }}
            >
              <span class="text-4xl sm:text-5xl transform transition-transform group-hover:scale-110 duration-300 filter drop-shadow-sm" aria-hidden="true">{item.emoji}</span>
              <span class="text-sm mt-2 font-medium opacity-80">{item.label || ''}</span>
              {#if selectedId === item.id}
                <div class="absolute top-2 right-2 animate-pulse" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                </div>
              {/if}
            </button>
          {/each}
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-base-200/50">
          <button class="btn btn-secondary flex-1 rounded-xl gap-2" on:click={checkOrder} disabled={completed}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Check Order
          </button>
          <button class="btn btn-ghost flex-1 rounded-xl border border-base-300 gap-2" on:click={restart}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Shuffle / Reset
          </button>
        </div>

        {#if feedback}
          <div class="mt-6 p-4 rounded-xl text-center font-semibold border
            {feedback.includes('Correct') ? 'bg-success/10 text-success border-success/20' : ''}
            {feedback.includes('Not') ? 'bg-error/10 text-error border-error/20' : ''}"
               role="status" aria-live="polite">
            {feedback}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if completed}
    <div class="card bg-base-100 shadow-soft overflow-hidden border border-base-200/50" in:fade>
      <div class="h-1.5 bg-gradient-to-r from-success via-secondary to-accent"></div>
      <div class="card-body items-center text-center p-8 sm:p-10">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-success/20 to-secondary/10 flex items-center justify-center text-5xl mb-5 shadow-inner">
            🎊
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold mb-2 text-base-content">Session Complete!</h3>
        <p class="text-base-content/60 mb-8 max-w-sm">You successfully arranged all the steps in three different safe-walk scenarios.</p>

        <div class="flex items-center gap-3 p-4 bg-success/10 rounded-xl border border-success/20 mb-6 w-full max-w-sm">
          <span class="text-2xl">🛡️</span>
          <div class="text-left">
              <h3 class="font-semibold text-success">Safety Expert!</h3>
              <p class="text-xs text-base-content/60">You've demonstrated understanding of safe walking procedures!</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button class="btn btn-secondary flex-1 rounded-xl gap-2" on:click={restart}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Play Again
          </button>
          <button class="btn btn-ghost flex-1 rounded-xl border border-base-300 hover:bg-base-200 gap-2" on:click={() => dispatch('back')}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Back Home
          </button>
        </div>
      </div>
    </div>
  {/if}
</section>
{/if}