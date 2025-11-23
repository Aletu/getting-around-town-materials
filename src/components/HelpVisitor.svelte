<script>
  import { SCENARIOS } from '../data/scenarios.js';
  import { PLACES } from '../data/places.js';
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import { teacherMode } from '../lib/store.js';

  const dispatch = createEventDispatcher();
  let currentIndex = 0;
  let score = 0;
  let attempts = 0;
  let wrongAttemptsForCurrent = 0;
  let finished = false;
  let feedback = '';
  // session size: pick a random subset of scenarios per session to keep sessions short
  const QUESTIONS_PER_SESSION = 10;

  // pool management: either use built-in scenarios or a custom teacher-provided pool
  let useCustomPool = false;
  let customPool = [];
  let teacherJson = '';
  let teacherError = '';

  function getActivePool() {
    const pool = useCustomPool && customPool.length ? customPool : SCENARIOS;
    return pool;
  }

  function makeSessionMessages() {
    const pool = getActivePool();
    return [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(QUESTIONS_PER_SESSION, pool.length));
  }

  // start with scenarios shuffled and limited to QUESTIONS_PER_SESSION so sessions are consistent
  let messages = makeSessionMessages();

  // reactive current message so Svelte updates when currentIndex or messages change
  $: current = messages[currentIndex];

  function buildOptions(msg) {
    const base = [msg.answer, ...msg.distractors];
    return base
      .map(v => {
        const p = PLACES.find(p => p.id === v);
        return { id: v, label: p?.label || v, emoji: p?.emoji || '❓' };
      })
      .sort(() => Math.random() - 0.5);
  }

  // make options reactive so they're rebuilt whenever the current message or messages change
  $: options = current ? buildOptions(current) : [];

  // debugging: track state so it's easier to see why we might be stuck on the first message
  function dbgState(tag) {
    // use console.debug so logs are visible in devtools without being too noisy
    console.debug('[HelpVisitor]', tag, {
      currentIndex,
      messagesLength: messages.length,
      currentId: current?.id,
      currentText: current?.text
    });
  }

  function selectPlace(id) {
    attempts++;
    dbgState('selectPlace - before check');
    if (current && id === current.answer) {
      score++;
      feedback = '✅ Correct!';
      dbgState('selectPlace - correct');
      advance();
    } else {
      feedback = '❌ Try again.';
      wrongAttemptsForCurrent += 1;
      dbgState('selectPlace - wrong');
    }
  }

  function advance() {
    setTimeout(() => {
      feedback = '';
      if (currentIndex < messages.length - 1) {
        currentIndex++;
        wrongAttemptsForCurrent = 0;
        dbgState('advance - incremented');
      } else {
        finished = true;
        dbgState('advance - finished');
      }
    }, 600);
  }

  function restart() {
    currentIndex = 0;
    score = 0;
    attempts = 0;
    wrongAttemptsForCurrent = 0;
    finished = false;
    feedback = '';
    messages = [...SCENARIOS].sort(() => Math.random() - 0.5).slice(0, Math.min(QUESTIONS_PER_SESSION, SCENARIOS.length));
    dbgState('restart');
    persist();
  }

  // persistence helpers
  function persist() {
    if (typeof window === 'undefined') return;
    const data = { currentIndex, score, attempts };
    window.localStorage.setItem('helpVisitorProgress', JSON.stringify(data));
  }
  $: persist(); // reactive persistence on changes

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

  // keep textarea roughly in sync with current pool when teacher mode toggles or pool changes
  $: if ($teacherMode) {
    refreshTeacherJson();
  }

  function handlePoolSourceChange(mode) {
    useCustomPool = mode === 'custom';
    teacherError = '';
    messages = makeSessionMessages();
    currentIndex = 0;
    score = 0;
    attempts = 0;
    wrongAttemptsForCurrent = 0;
    finished = false;
    feedback = '';
    refreshTeacherJson();
  }

  function applyTeacherJsonFromTextarea() {
    teacherError = '';
    try {
      const parsed = JSON.parse(teacherJson);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of scenario objects.');
      }
      // basic shape validation for helpful errors
      for (const item of parsed) {
        if (
          typeof item !== 'object' ||
          typeof item.text !== 'string' ||
          typeof item.answer !== 'string' ||
          !Array.isArray(item.distractors)
        ) {
          throw new Error('Each scenario needs text, answer, and distractors[].');
        }
      }
      customPool = parsed;
      useCustomPool = true;
      messages = makeSessionMessages();
      currentIndex = 0;
      score = 0;
      attempts = 0;
      wrongAttemptsForCurrent = 0;
      finished = false;
      feedback = '';
      teacherError = '';
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
      a.download = 'help-visitor-scenarios.json';
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
          if (
            typeof item !== 'object' ||
            typeof item.text !== 'string' ||
            typeof item.answer !== 'string' ||
            !Array.isArray(item.distractors)
          ) {
            throw new Error('Each scenario needs text, answer, and distractors[].');
          }
        }
        customPool = parsed;
        useCustomPool = true;
        messages = makeSessionMessages();
        currentIndex = 0;
        score = 0;
        attempts = 0;
        wrongAttemptsForCurrent = 0;
        finished = false;
        feedback = '';
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

  onMount(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('helpVisitorProgress');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.currentIndex === 'number' && parsed.currentIndex < messages.length) {
          currentIndex = parsed.currentIndex;
        }
        if (typeof parsed.score === 'number') score = parsed.score;
        if (typeof parsed.attempts === 'number') attempts = parsed.attempts;
      }
    } catch (e) {
      console.warn('Failed to restore progress', e);
    }
  });
</script>

<section class="space-y-4">
  <div class="flex items-center gap-2">
    <button class="btn btn-sm" on:click={() => dispatch('back')} aria-label="Go back">← Back</button>
    <h2 class="text-xl font-semibold">Help the Visitor – Scenarios</h2>
  </div>
  <p class="text-sm opacity-80">
    Read the scenario. Click the correct place.
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
          with <code>text</code>, <code>answer</code> (a place id), and
          <code>distractors</code> (other place ids).
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

  {#if !finished}
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="mb-3 space-y-1">
          <div class="flex items-center gap-2 text-primary font-semibold">
            <span class="text-lg" aria-hidden="true">🧭</span>
            <span>Scenario</span>
            <span class="badge badge-info ml-auto py-4 px-3">{currentIndex + 1}/{messages.length}</span>
          </div>
          <progress
            class="progress progress-primary w-full"
            value={currentIndex + 1}
            max={messages.length}
            aria-label={`Scenario progress: ${currentIndex + 1} of ${messages.length}`}
          ></progress>
        </div>
        {#key current?.id}
          <div class="mb-2">
            <p class="mt-2 text-base-content text-base md:text-lg leading-relaxed" aria-live="polite">{current?.text}</p>
          </div>
          <div class="grid gap-3 mt-4 sm:grid-cols-2 md:grid-cols-3">
            {#each options as opt (opt.id)}
            <button
              class="btn btn-outline flex flex-col gap-1"
              on:click={() => selectPlace(opt.id)}
              aria-label={"Select " + opt.label}
            >
              <span class="text-2xl">{opt.emoji}</span>
              <span class="text-sm md:text-base">{opt.label}</span>
            </button>
            {/each}
          </div>
  {/key}
        {#if feedback}
          <div class="mt-3 text-sm font-semibold" role="status">{feedback}</div>
        {/if}
        {#if wrongAttemptsForCurrent >= 1 && current?.hint}
          <div class="alert alert-info mt-3">
            <span class="font-medium">Hint:</span>
            <span class="ml-2">{current.hint}</span>
          </div>
        {/if}
        <div class="mt-4 text-xs opacity-70">
          Score: {score} / {messages.length} | Attempts: {attempts}
        </div>
      </div>
    </div>
  {:else}
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <div class="text-6xl mb-4 animate-bounce">🎉</div>
        <h3 class="text-2xl font-bold mb-2">Great Work!</h3>
        <p class="text-sm opacity-80 mb-4">You've completed all the scenarios</p>
        
        <div class="stats stats-vertical sm:stats-horizontal shadow mb-6">
          <div class="stat place-items-center">
            <div class="stat-title">Correct Answers</div>
            <div class="stat-value text-primary">{score}</div>
            <div class="stat-desc">out of {messages.length}</div>
          </div>
          
          <div class="stat place-items-center">
            <div class="stat-title">Accuracy</div>
            <div class="stat-value text-secondary">{Math.round((score / attempts) * 100)}%</div>
            <div class="stat-desc">{attempts} total attempts</div>
          </div>
        </div>

        {#if score === messages.length}
          <div class="badge badge-success gap-2 p-4 mb-4">
            <span class="text-lg">⭐</span>
            <span>Perfect Score!</span>
          </div>
        {:else if score >= messages.length * 0.8}
          <div class="badge badge-info gap-2 p-4 mb-4">
            <span class="text-lg">👏</span>
            <span>Excellent!</span>
          </div>
        {:else if score >= messages.length * 0.6}
          <div class="badge badge-warning gap-2 p-4 mb-4">
            <span class="text-lg">👍</span>
            <span>Good effort!</span>
          </div>
        {/if}

        <div class="flex flex-col sm:flex-row gap-3 mt-2">
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