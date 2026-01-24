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
  <div class="bg-base-100 rounded-box shadow-lg p-6 mb-8 border border-base-300">
    <div class="flex items-center justify-between mb-6 border-b pb-4">
        <div class="flex items-center gap-3">
            <button class="btn btn-circle btn-ghost btn-sm" on:click={() => dispatch('back')} aria-label="Go back">
                <span class="text-xl">←</span>
            </button>
            <div>
                <h2 class="text-2xl font-bold text-base-content">Sequence Editor</h2>
                <p class="text-sm opacity-60">Create ordering activities for safe walking.</p>
            </div>
        </div>
        <div class="badge badge-primary badge-outline">{$safeWalkStore.length} Sequences</div>
    </div>

    <div class="space-y-3">
        {#each $safeWalkStore as scenario, i}
        <div class="collapse collapse-arrow bg-base-200 border border-base-300 rounded-box">
            <input type="checkbox" /> 
            <div class="collapse-title text-lg font-medium flex items-center gap-3">
                <span class="badge badge-neutral">{i + 1}</span>
                <span class="truncate flex-1">{scenario.text || 'New Sequence'}</span>
            </div>
            <div class="collapse-content bg-base-100 pt-4 border-t border-base-200"> 
                <div class="grid gap-4">
                    <div class="form-control w-full">
                        <label class="label font-bold">Scenario Description</label>
                        <textarea class="textarea textarea-bordered w-full h-24" placeholder="Describe the situation..." bind:value={scenario.text}></textarea>
                    </div>
                    
                    <div class="bg-base-200/50 p-4 rounded-xl">
                        <div class="flex justify-between items-center mb-4">
                            <label class="label font-bold">Sequence Steps (Correct Order)</label>
                            <div class="badge badge-info badge-outline">Steps 1 to {scenario.sequence.length}</div>
                        </div>
                        
                        <div class="space-y-3">
                            {#each scenario.sequence as item, j}
                                <div class="flex items-start gap-3 bg-base-100 p-3 rounded-lg border border-base-200 shadow-sm">
                                    <div class="badge badge-neutral mt-2">{j + 1}</div>
                                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                                        <div class="form-control">
                                            <label class="label text-xs uppercase font-bold opacity-50">Label</label>
                                            <input type="text" class="input input-sm input-bordered" placeholder="e.g. Stop" bind:value={item.label} />
                                        </div>
                                        <div class="form-control">
                                            <label class="label text-xs uppercase font-bold opacity-50">Emoji</label>
                                            <input type="text" class="input input-sm input-bordered" placeholder="e.g. 🛑" bind:value={item.emoji} />
                                        </div>
                                        <div class="form-control">
                                            <label class="label text-xs uppercase font-bold opacity-50">Alt Text</label>
                                            <input type="text" class="input input-sm input-bordered" placeholder="Description" bind:value={item.alt} />
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button class="btn btn-ghost btn-sm text-error hover:bg-error/10" on:click={() => deleteScenario(i)}>
                            🗑️ Delete Sequence
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/each}
    </div>

    <button class="btn btn-primary w-full mt-6 shadow-lg" on:click={addScenario}>
        <span class="text-xl">+</span> Add New Sequence
    </button>
  </div>
{:else}
<section class="space-y-6 max-w-4xl mx-auto" in:fade={{ duration: 300 }}>
  <div class="flex items-center gap-4">
    <button class="btn btn-circle btn-ghost bg-base-100 shadow-sm hover:shadow-md hover:bg-base-200 hover:scale-105 transition-all" on:click={() => dispatch('back')} aria-label="Go back">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
    </button>
    <div>
        <h2 class="text-2xl font-bold text-base-content">Safe Walk Sequence</h2>
        <p class="text-sm opacity-70">Order the steps correctly.</p>
    </div>
  </div>

  {#if !completed}
    <div class="card bg-base-100 shadow-xl border-t-4 border-secondary">
      <div class="card-body p-6 sm:p-8">
        <div class="mb-6 space-y-2">
          <div class="flex items-center justify-between text-sm font-bold uppercase tracking-wider opacity-60">
            <span>Progress</span>
            <span>{currentIndex + 1} / {SCENARIOS_PER_SESSION}</span>
          </div>
          <progress
            class="progress progress-secondary w-full h-3 rounded-full bg-base-200"
            value={currentIndex + 1}
            max={SCENARIOS_PER_SESSION}
            aria-label={`Scenario progress: ${currentIndex + 1} of ${SCENARIOS_PER_SESSION}`}
          ></progress>
        </div>
        
        <div class="bg-base-200/50 p-6 rounded-2xl border border-base-200 mb-8 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
            <h3 class="font-bold text-sm uppercase text-secondary mb-2">Scenario:</h3>
            <p class="text-xl md:text-2xl font-medium leading-relaxed text-base-content/90">{currentScenario.text}</p>
        </div>

        <p class="text-sm text-base-content/60 mb-2">💡 <strong>Tip:</strong> Click to select, then click another to swap. <kbd class="kbd kbd-sm">↑↓←→</kbd> to move selected item.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" role="listbox" aria-label="Reorder these steps into the correct sequence" aria-describedby="sequence-instructions">
          <span id="sequence-instructions" class="sr-only">Use arrow keys to move a selected item. Press Enter or Space to select an item, then use arrow keys to move it. Press Escape to deselect.</span>
          {#each items as item, index (item.id)}
            <button
              type="button"
              data-sequence-item
              class="group relative flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] active:scale-95 shadow-sm hover:shadow-md cursor-pointer select-none touch-manipulation min-h-[8rem]
              {selectedId !== item.id ? 'bg-base-100 border-base-200 hover:border-secondary/50' : ''}
              {selectedId === item.id ? 'bg-secondary text-secondary-content border-secondary ring-4 ring-secondary/20' : ''}"
              on:click={() => handleItemClick(item.id)}
              on:keydown={(e) => handleKeydown(e, index)}
              aria-label="{item.label || item.alt}. Position {index + 1} of {items.length}. {selectedId === item.id ? 'Selected. Use arrow keys to move.' : 'Press Enter to select.'}"
              role="option"
              aria-selected={selectedId === item.id}
              animate:flip={{ duration: 300 }}
            >
              <span class="text-6xl transform transition-transform group-hover:scale-110 duration-300 filter drop-shadow-sm" aria-hidden="true">{item.emoji}</span>
              <span class="text-sm mt-2 font-medium opacity-80">{item.label || ''}</span>
              {#if selectedId === item.id}
                <div class="absolute top-2 right-2 animate-pulse" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                </div>
              {/if}
            </button>
          {/each}
        </div>

        <div class="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-base-200">
          <button class="btn btn-secondary flex-1 btn-lg rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all font-bold tracking-wide text-lg" on:click={checkOrder} disabled={completed}>
            Check Order
          </button>
          <button class="btn btn-neutral btn-outline flex-1 btn-lg rounded-xl hover:bg-neutral hover:text-neutral-content transition-all font-bold tracking-wide text-lg" on:click={restart}>
            Shuffle / Reset
          </button>
        </div>

        {#if feedback}
          <div class="mt-6 p-4 rounded-xl text-center font-bold text-lg animate-bounce-slow" 
               class:bg-success={feedback.includes('Correct')} 
               class:text-success-content={feedback.includes('Correct')}
               class:bg-error={feedback.includes('Not')}
               class:text-error-content={feedback.includes('Not')}
               role="status" aria-live="polite">
            {feedback}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if completed}
    <div class="card bg-base-100 shadow-xl border-t-4 border-success" in:fade>
      <div class="card-body items-center text-center p-10">
        <div class="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-6xl mb-6 animate-bounce-slow">
            🎊
        </div>
        <h3 class="text-3xl font-black mb-3">Session Complete!</h3>
        <p class="text-lg opacity-70 mb-8 max-w-md">You successfully arranged all the steps in three different safe-walk scenarios.</p>

        <div class="alert alert-success shadow-sm mb-8 text-left max-w-md">
          <span class="text-2xl">🛡️</span>
          <div>
              <h3 class="font-bold">Safety Expert!</h3>
              <div class="text-xs">You've demonstrated understanding of safe walking procedures!</div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button class="btn btn-primary flex-1 rounded-xl shadow-lg hover:scale-105 transition-transform" on:click={restart}>
            <span class="text-lg mr-1">🔄</span>
            Play Again
          </button>
          <button class="btn btn-outline flex-1 rounded-xl hover:bg-base-200" on:click={() => dispatch('back')}>
            <span class="text-lg mr-1">🏠</span>
            Back Home
          </button>
        </div>
      </div>
    </div>
  {/if}
</section>
{/if}