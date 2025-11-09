<script>
  import { SAFE_WALK_SCENARIOS } from '../data/sequenceText.js';
  import { createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';
  import { tick } from 'svelte';

  const dispatch = createEventDispatcher();
  
  // Select a random scenario on load
  let currentScenario = SAFE_WALK_SCENARIOS[Math.floor(Math.random() * SAFE_WALK_SCENARIOS.length)];
  let items = currentScenario.sequence.map(i => ({ ...i })).sort(() => Math.random() - 0.5);
  let feedback = '';
  let completed = false;
  let selectedId = null;

  async function handleItemClick(id) {
    if (completed) return;

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

  function checkOrder() {
    const isCorrect = items.every((it, idx) => it.correctIndex === idx);
    if (isCorrect) { feedback = '✅ Correct sequence!'; completed = true; }
    else feedback = '❌ Not yet. Try again.';
  }
  function restart() {
    // Pick a different random scenario (avoid repeating the same one)
    if (SAFE_WALK_SCENARIOS.length > 1) {
      let newScenario;
      do {
        newScenario = SAFE_WALK_SCENARIOS[Math.floor(Math.random() * SAFE_WALK_SCENARIOS.length)];
      } while (newScenario.id === currentScenario.id);
      currentScenario = newScenario;
    }
    items = currentScenario.sequence.map(i => ({ ...i })).sort(() => Math.random() - 0.5);
    feedback = '';
    completed = false;
    selectedId = null;
  }
</script>

<section class="space-y-4">
  <div class="flex items-center gap-2">
    <button class="btn btn-sm" on:click={() => dispatch('back')} aria-label="Go back">← Back</button>
    <h2 class="text-2xl font-bold">Safe Walk Sequence</h2>
  </div>
  <p class="text-base font-medium">
    Read the short text. Tap an item to select it, then tap another to swap their positions.
  </p>

  {#if !completed}

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-5">
        <div class="flex items-center gap-2 mb-2 text-primary">
          <span class="text-xl" aria-hidden="true">🧭</span>
          <h3 class="font-semibold">Scenario</h3>
        </div>
        <p class="text-base-content text-lg md:text-xl leading-relaxed md:leading-loose">{currentScenario.text}</p>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list" aria-label="Safe walk sequence list">
      {#each items as item (item.id)}
        <div
          class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-base-300 select-none"
          on:click={() => handleItemClick(item.id)}
          role="listitem"
          class:selected={selectedId === item.id}
          animate:flip={{ duration: 160 }}
        >
          <div class="card-body items-center p-4">
            <span class="text-5xl" aria-hidden="true">{item.emoji}</span>
            <span class="text-sm sm:text-base font-semibold mt-2">{item.label}</span>
          </div>
        </div>
      {/each}
    </div>

    <div class="flex gap-2">
      <button class="btn btn-primary" on:click={checkOrder} disabled={completed}>Check Order</button>
      <button class="btn btn-secondary" on:click={restart}>Shuffle</button>
    </div>

    {#if feedback}
      <div class="mt-2 text-base font-bold" role="status" aria-live="polite">{feedback}</div>
    {/if}
  {/if}

  {#if completed}
    <div class="card bg-base-100 shadow-xl mt-6">
      <div class="card-body items-center text-center">
        <div class="text-6xl mb-4 animate-bounce">🎊</div>
        <h3 class="text-3xl font-bold mb-3">Perfect Sequence!</h3>
        <p class="text-base mb-4">You successfully arranged all the steps in the correct order</p>
        
        <div class="flex flex-wrap gap-2 justify-center mb-4">
          {#each items as item, i}
            <div class="badge badge-lg badge-success gap-2">
              <span>{item.emoji}</span>
              <span class="text-xs">{i + 1}</span>
            </div>
          {/each}
        </div>

        <div class="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="text-base font-medium">You've demonstrated understanding of safe walking procedures!</span>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button class="btn btn-primary" on:click={restart}>
            <span class="text-lg mr-1">🔄</span>
            Try Again
          </button>
          <button class="btn btn-outline" on:click={() => dispatch('back')}>
            <span class="text-lg mr-1">🏠</span>
            Back Home
          </button>
        </div>
      </div>
    </div>
  {/if}
</section>  

<style>
  /* smooth transitions for reorder and selected item */
  .card {
     transition: transform 160ms cubic-bezier(.2,.9,.3,1), box-shadow 160ms ease, opacity 120ms ease;
  }
  .card.selected {
    box-shadow: 0 10px 22px rgba(0,0,0,0.14);
     opacity: 0.985;
    outline: 2px solid rgba(59,130,246,0.45); /* primary-blue outline */
    outline-offset: 2px;
    border-color: rgba(59,130,246,0.6);
  }
  .card:focus-visible {
    outline: 2px solid rgba(59,130,246,0.35);
    outline-offset: 2px;
  }
</style>