<script>
  import { SAFE_WALK_SCENARIOS } from '../data/sequenceText.js';
  import { createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';
  import { tick } from 'svelte';
  import { teacherMode } from '../lib/store.js';

  const dispatch = createEventDispatcher();

  // Session state: we play through 3 distinct scenarios before the module is "fully" completed
  const SCENARIOS_PER_SESSION = 3;

  // pool management: either use built-in scenarios or a custom teacher-provided pool
  let useCustomPool = false;
  let customPool = [];
  let teacherJson = '';
  let teacherError = '';

  function getActivePool() {
    const pool = useCustomPool && customPool.length ? customPool : SAFE_WALK_SCENARIOS;
    return pool;
  }

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
    const shuffled = [...getActivePool()].sort(() => Math.random() - 0.5);
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

  // ------- Teacher tools (JSON import / export) -------

  function refreshTeacherJson() {
    const pool = getActivePool();
    try {
      teacherJson = JSON.stringify(pool, null, 2);
      teacherError = '';
    } catch (e) {
      teacherError = 'Could not serialise scenarios to JSON.';
    }
  }

  $: if ($teacherMode) {
    refreshTeacherJson();
  }

  function handlePoolSourceChange(mode) {
    useCustomPool = mode === 'custom';
    teacherError = '';
    startNewSession();
    refreshTeacherJson();
  }

  function applyTeacherJsonFromTextarea() {
    teacherError = '';
    try {
      const parsed = JSON.parse(teacherJson);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of scenario objects.');
      }
      for (const item of parsed) {
        if (typeof item !== 'object' || typeof item.text !== 'string' || !Array.isArray(item.sequence)) {
          throw new Error('Each scenario needs text and sequence[].');
        }
      }
      customPool = parsed;
      useCustomPool = true;
      startNewSession();
    } catch (e) {
      teacherError = e.message || 'Could not parse JSON.';
    }
  }

  function downloadCurrentPool() {
    try {
      const data = getActivePool();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'safe-walk-scenarios.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      teacherError = 'Could not download JSON.';
    }
  }

  function handleFileUpload(event) {
    const [file] = event.target.files || [];
    if (!file) return;
    teacherError = '';
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) {
          throw new Error('JSON must be an array of scenario objects.');
        }
        for (const item of parsed) {
          if (typeof item !== 'object' || typeof item.text !== 'string' || !Array.isArray(item.sequence)) {
            throw new Error('Each scenario needs text and sequence[].');
          }
        }
        customPool = parsed;
        useCustomPool = true;
        startNewSession();
        teacherJson = JSON.stringify(customPool, null, 2);
      } catch (e) {
        teacherError = e.message || 'Could not parse uploaded JSON.';
      }
    };
    reader.onerror = () => {
      teacherError = 'Could not read file.';
    };
    reader.readAsText(file);
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

  {#if $teacherMode}
    <details class="mt-2 mb-4 collapse bg-base-200">
      <summary class="collapse-title font-semibold cursor-pointer">
        Teacher tools – scenario pool
      </summary>
      <div class="collapse-content space-y-3 text-sm">
        <div class="flex flex-wrap items-center gap-3">
          <span class="font-medium mr-2">Scenario source:</span>
          <div class="join">
            <button
              type="button"
              class="btn btn-xs join-item {useCustomPool ? '' : 'btn-primary'}"
              on:click={() => handlePoolSourceChange('default')}
            >
              Default examples
            </button>
            <button
              type="button"
              class="btn btn-xs join-item {useCustomPool ? 'btn-primary' : ''}"
              on:click={() => handlePoolSourceChange('custom')}
            >
              Custom pool
            </button>
          </div>
          <span class="badge badge-ghost">
            Active items: {getActivePool().length}
          </span>
        </div>

        <p class="text-xs opacity-80">
          Paste or edit scenarios here. Each item should look like the built-in examples
          with <code>text</code> and a <code>sequence</code> array of locations
          with <code>id</code>, <code>label</code>, <code>emoji</code>, and <code>correctIndex</code>.
        </p>

        <textarea
          class="textarea textarea-bordered w-full font-mono text-xs h-48"
          bind:value={teacherJson}
        ></textarea>

        <div class="flex flex-wrap gap-2 items-center">
          <button class="btn btn-sm btn-primary" type="button" on:click={applyTeacherJsonFromTextarea}>
            Use JSON above
          </button>
          <button class="btn btn-sm" type="button" on:click={downloadCurrentPool}>
            Download current pool
          </button>
          <label class="btn btn-sm btn-outline">
            Upload JSON
            <input type="file" accept="application/json" class="hidden" on:change={handleFileUpload} />
          </label>
        </div>

        {#if teacherError}
          <div class="alert alert-error mt-2 text-xs">
            <span>{teacherError}</span>
          </div>
        {/if}
      </div>
    </details>
  {/if}

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