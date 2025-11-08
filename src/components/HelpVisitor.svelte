<script>
  import { SCENARIOS } from '../data/scenarios.js';
  import { PLACES } from '../data/places.js';
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  const dispatch = createEventDispatcher();
  let currentIndex = 0;
  let score = 0;
  let attempts = 0;
  let wrongAttemptsForCurrent = 0;
  let finished = false;
  let feedback = '';
  // start with scenarios shuffled so the same scenario doesn't always appear first
  let messages = [...SCENARIOS].sort(() => Math.random() - 0.5);

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
    messages = [...SCENARIOS].sort(() => Math.random() - 0.5);
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

  {#if !finished}
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <progress class="progress progress-primary w-full mb-3" value={currentIndex} max={messages.length}></progress>
        {#key current?.id}
          <div class="mb-2">
            <div class="flex items-center gap-2 text-primary font-semibold">
              <span class="text-lg" aria-hidden="true">🧭</span>
              <span>Scenario</span>
              <span class="badge badge-info ml-auto py-4 px-3">{currentIndex + 1}/{messages.length}</span>
            </div>
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