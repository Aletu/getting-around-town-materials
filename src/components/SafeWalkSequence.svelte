<script>
  import { safeWalkStore, teacherMode } from '../stores.js';
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
  <div class="space-y-4">
    <div class="flex items-center gap-2">
        <button class="btn btn-sm" on:click={() => dispatch('back')} aria-label="Go back">← Back</button>
        <h2 class="text-xl font-semibold">Teacher Mode: Edit Sequences</h2>
    </div>
    {#each $safeWalkStore as scenario, i}
      <div class="card bg-base-100 shadow p-4">
        <div class="form-control">
          <label class="label">Scenario Text</label>
          <textarea class="textarea textarea-bordered" bind:value={scenario.text}></textarea>
        </div>
        <div class="mt-2">
            <h3 class="font-bold">Sequence Items (in correct order)</h3>
            {#each scenario.sequence as item, j}
                <div class="grid grid-cols-3 gap-2 mb-2 border p-2 rounded">
                    <div class="form-control">
                        <label class="label text-xs">Label</label>
                        <input type="text" class="input input-sm input-bordered" bind:value={item.label} />
                    </div>
                    <div class="form-control">
                        <label class="label text-xs">Emoji</label>
                        <input type="text" class="input input-sm input-bordered" bind:value={item.emoji} />
                    </div>
                    <div class="form-control">
                        <label class="label text-xs">Alt Text</label>
                        <input type="text" class="input input-sm input-bordered" bind:value={item.alt} />
                    </div>
                </div>
            {/each}
        </div>
        <div class="mt-2 text-right">
            <button class="btn btn-error btn-sm" on:click={() => deleteScenario(i)}>Delete</button>
        </div>
      </div>
    {/each}
    <button class="btn btn-success w-full" on:click={addScenario}>Add New Scenario</button>
  </div>
{:else}
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
{/if}  

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