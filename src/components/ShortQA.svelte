<script>
  import { SHORT_QA_ITEMS } from '../data/shortQA.js';
  import { createEventDispatcher } from 'svelte';
  import { teacherMode } from '../lib/store.js';

  const dispatch = createEventDispatcher();

  const QUESTIONS_PER_SESSION = 5;

  // pool management: either use built-in questions or a custom teacher-provided pool
  let useCustomPool = false;
  let customPool = [];
  let teacherJson = '';
  let teacherError = '';

  function getActivePool() {
    const pool = useCustomPool && customPool.length ? customPool : SHORT_QA_ITEMS;
    return pool;
  }

  function makeSessionItems() {
    const pool = getActivePool();
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(QUESTIONS_PER_SESSION, pool.length));
  }

  let items = [];
  let currentIndex = 0;
  let score = 0;
  let attempts = 0;
  let finished = false;
  let feedback = '';
  let selectedId = null;

  function startSession() {
    items = makeSessionItems();
    currentIndex = 0;
    score = 0;
    attempts = 0;
    finished = false;
    feedback = '';
    selectedId = null;
  }

  $: current = items[currentIndex];

  function selectOption(id) {
    if (finished || !current) return;

    attempts += 1;
    selectedId = id;

    if (id === current.answer) {
      score += 1;
      feedback = '✅ That answer makes sense for this question.';
      setTimeout(() => {
        feedback = '';
        selectedId = null;
        if (currentIndex < items.length - 1) {
          currentIndex += 1;
        } else {
          finished = true;
        }
      }, 700);
    } else {
      feedback = "❌ That doesn't quite fit. Try again.";
    }
  }

  function restart() {
    startSession();
  }

  // initialize first session
  startSession();

  // ------- Teacher tools (JSON import / export) -------

  function refreshTeacherJson() {
    const pool = getActivePool();
    try {
      teacherJson = JSON.stringify(pool, null, 2);
      teacherError = '';
    } catch (e) {
      teacherError = 'Could not serialise questions to JSON.';
    }
  }

  $: if ($teacherMode) {
    refreshTeacherJson();
  }

  function handlePoolSourceChange(mode) {
    useCustomPool = mode === 'custom';
    teacherError = '';
    startSession();
    refreshTeacherJson();
  }

  function applyTeacherJsonFromTextarea() {
    teacherError = '';
    try {
      const parsed = JSON.parse(teacherJson);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of question objects.');
      }
      for (const item of parsed) {
        if (
          typeof item !== 'object' ||
          typeof item.question !== 'string' ||
          !Array.isArray(item.options) ||
          typeof item.answer !== 'string'
        ) {
          throw new Error('Each question needs question, options[], and answer.');
        }
      }
      customPool = parsed;
      useCustomPool = true;
      startSession();
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
      a.download = 'short-qa-items.json';
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
          throw new Error('JSON must be an array of question objects.');
        }
        for (const item of parsed) {
          if (
            typeof item !== 'object' ||
            typeof item.question !== 'string' ||
            !Array.isArray(item.options) ||
            typeof item.answer !== 'string'
          ) {
            throw new Error('Each question needs question, options[], and answer.');
          }
        }
        customPool = parsed;
        useCustomPool = true;
        startSession();
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
    <h2 class="text-xl font-semibold">Short Q&A</h2>
  </div>
  <p class="text-sm opacity-80">
    Read the question and choose the answer that makes the most sense.
  </p>

  {#if $teacherMode}
    <details class="mt-2 mb-4 collapse bg-base-200">
      <summary class="collapse-title font-semibold cursor-pointer">
        Teacher tools – question pool
      </summary>
      <div class="collapse-content space-y-3 text-sm">
        <div class="flex flex-wrap items-center gap-3">
          <span class="font-medium mr-2">Question source:</span>
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
          Paste or edit questions here. Each item should look like the built-in examples
          with <code>question</code>, an <code>options</code> array of answers, and an
          <code>answer</code> id that matches one of the option ids.
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
  {#if !finished && current}
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="mb-3 space-y-1">
          <div class="flex items-center gap-2 text-primary font-semibold">
            <span class="text-lg" aria-hidden="true">💬</span>
            <span>Question</span>
            <span class="badge badge-info ml-auto py-4 px-3">{currentIndex + 1}/{items.length}</span>
          </div>
          <progress
            class="progress progress-primary w-full"
            value={currentIndex + 1}
            max={items.length}
            aria-label={`Question progress: ${currentIndex + 1} of ${items.length}`}
          ></progress>
        </div>

        <p class="mt-2 text-base-content text-base md:text-lg leading-relaxed" aria-live="polite">{current.question}</p>

        <div class="grid gap-3 mt-4 sm:grid-cols-2">
          {#each current.options as opt (opt.id)}
            <button
              type="button"
              class="btn btn-outline justify-start flex gap-2"
              class:btn-primary={selectedId === opt.id && opt.id === current.answer}
              on:click={() => selectOption(opt.id)}
              aria-label={`Answer option: ${opt.text}`}
            >
              <span>{opt.text}</span>
            </button>
          {/each}
        </div>

        {#if feedback}
          <div class="mt-3 text-sm font-semibold" role="status" aria-live="polite">{feedback}</div>
        {/if}

        <div class="mt-4 text-xs opacity-70">
          Score: {score} / {items.length} | Attempts: {attempts}
        </div>
      </div>
    </div>
  {:else}
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <div class="text-6xl mb-4 animate-bounce">🌟</div>
        <h3 class="text-2xl font-bold mb-2">Nice work!</h3>
        <p class="text-sm opacity-80 mb-4">You answered all questions in this short Q&A session.</p>

        <div class="stats stats-vertical sm:stats-horizontal shadow mb-6">
          <div class="stat place-items-center">
            <div class="stat-title">Correct Answers</div>
            <div class="stat-value text-primary">{score}</div>
            <div class="stat-desc">out of {items.length}</div>
          </div>

          <div class="stat place-items-center">
            <div class="stat-title">Accuracy</div>
            <div class="stat-value text-secondary">{items.length ? Math.round((score / attempts) * 100) : 0}%</div>
            <div class="stat-desc">{attempts} total attempts</div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-2">
          <button class="btn btn-primary" on:click={restart}>
            <span class="text-lg mr-1">🔄</span>
            Try Another Set
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
