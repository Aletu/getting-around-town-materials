<script>
  import { SAFE_WALK_SCENARIOS } from '../data/sequenceText.js';
  import { createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';
  import { tick } from 'svelte';

  const dispatch = createEventDispatcher();

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
    const shuffled = [...SAFE_WALK_SCENARIOS].sort(() => Math.random() - 0.5);
    sessionScenarios = shuffled.slice(0, SCENARIOS_PER_SESSION);
    currentIndex = 0;
    completed = false;
    loadCurrentScenario();
  }

  function loadCurrentScenario() {
    currentScenario = sessionScenarios[currentIndex];
    items = currentScenario.sequence.map(i => ({ ...i })).sort(() => Math.random() - 0.5);
    feedback = '';
    scenarioDone = false;
    selectedId = null;
  }

  // initialise first session
  startNewSession();

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
        <div class="mb-3 space-y-1">
          <div class="flex items-center gap-2 text-primary font-semibold">
            <span class="text-xl" aria-hidden="true">🧭</span>
            <span>Scenario</span>
            <span class="badge badge-info ml-auto py-4 px-3">{currentIndex + 1}/{SCENARIOS_PER_SESSION}</span>
          </div>
          <progress
            class="progress progress-primary w-full"
            value={currentIndex + 1}
            max={SCENARIOS_PER_SESSION}
            aria-label={`Scenario progress: ${currentIndex + 1} of ${SCENARIOS_PER_SESSION}`}
          ></progress>
        </div>
        <p class="text-base-content text-lg md:text-xl leading-relaxed md:leading-loose">{currentScenario.text}</p>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list" aria-label="Safe walk sequence list">
      {#each items as item (item.id)}
        <button
          type="button"
          class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-base-300 select-none text-left"
          on:click={() => handleItemClick(item.id)}
          aria-pressed={selectedId === item.id}
          class:selected={selectedId === item.id}
          animate:flip={{ duration: 160 }}
        >
          <div class="card-body items-center p-4">
            <span class="text-5xl" aria-hidden="true">{item.emoji}</span>
            <span class="text-sm sm:text-base font-semibold mt-2">{item.label}</span>
          </div>
        </button>
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
        <h3 class="text-3xl font-bold mb-3">Session complete!</h3>
        <p class="text-base mb-4">You successfully arranged all the steps in three different safe-walk scenarios.</p>

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