<script>
  import { scenariosStore, teacherMode } from '../stores.js';
  import { PLACES } from '../data/places.js';
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();
  let currentIndex = 0;
  let score = 0;
  let attempts = 0;
  let wrongAttemptsForCurrent = 0;
  let finished = false;
  let selectedId = null;
  let buttonStatus = null; // 'correct' or 'incorrect'
  // session size: pick a random subset of scenarios per session to keep sessions short
  const QUESTIONS_PER_SESSION = 10;
  // start with scenarios shuffled and limited to QUESTIONS_PER_SESSION so sessions are consistent
  let messages = [];

  // Initialize messages when store is ready
  $: if ($scenariosStore.length > 0 && messages.length === 0) {
      restart();
  }

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
    selectedId = id;
    dbgState('selectPlace - before check');
    if (current && id === current.answer) {
      score++;
      buttonStatus = 'correct';
      dbgState('selectPlace - correct');
      advance();
    } else {
      buttonStatus = 'incorrect';
      wrongAttemptsForCurrent += 1;
      dbgState('selectPlace - wrong');
      setTimeout(() => {
        buttonStatus = null;
        selectedId = null;
      }, 600);
    }
  }

  function advance() {
    setTimeout(() => {
      buttonStatus = null;
      selectedId = null;
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
    selectedId = null;
    buttonStatus = null;
    messages = [...$scenariosStore].sort(() => Math.random() - 0.5).slice(0, Math.min(QUESTIONS_PER_SESSION, $scenariosStore.length));
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

  // Teacher Mode Functions
  function addScenario() {
    $scenariosStore = [...$scenariosStore, {
        id: Date.now(),
        text: 'New Scenario',
        hint: 'New Hint',
        answer: 'park',
        distractors: ['school', 'library']
    }];
  }

  function deleteScenario(index) {
    const newScenarios = [...$scenariosStore];
    newScenarios.splice(index, 1);
    $scenariosStore = newScenarios;
  }

  function updateDistractors(index, value) {
    const distractors = value.split(',').map(s => s.trim()).filter(s => s);
    $scenariosStore[index].distractors = distractors;
    $scenariosStore = $scenariosStore; 
  }

  function addDistractor(index, placeId) {
    if (!placeId) return;
    const scenario = $scenariosStore[index];
    if (!scenario.distractors.includes(placeId)) {
        scenario.distractors = [...scenario.distractors, placeId];
        $scenariosStore = $scenariosStore;
    }
  }

  function removeDistractor(index, distractorIndex) {
    const scenario = $scenariosStore[index];
    scenario.distractors.splice(distractorIndex, 1);
    scenario.distractors = scenario.distractors; // trigger reactivity
    $scenariosStore = $scenariosStore;
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
                <h2 class="text-2xl font-bold text-base-content">Scenario Editor</h2>
                <p class="text-sm opacity-60">Manage the questions and answers for the "Help Visitor" module.</p>
            </div>
        </div>
        <div class="badge badge-primary badge-outline">{$scenariosStore.length} Scenarios</div>
    </div>

    <div class="space-y-3">
        {#each $scenariosStore as scenario, i}
        <div class="collapse collapse-arrow bg-base-200 border border-base-300 rounded-box">
            <input type="checkbox" /> 
            <div class="collapse-title text-lg font-medium flex items-center gap-3">
                <span class="badge badge-neutral">{i + 1}</span>
                <span class="truncate flex-1">{scenario.text || 'New Scenario'}</span>
                {#if !scenario.text}<span class="badge badge-warning badge-sm">Empty</span>{/if}
            </div>
            <div class="collapse-content bg-base-100 pt-4 border-t border-base-200"> 
                <div class="grid gap-4">
                    <div class="form-control w-full">
                        <label class="label">
                            <span class="label-text font-bold">Scenario Text</span>
                            <span class="label-text-alt">What the visitor says</span>
                        </label>
                        <input type="text" placeholder="e.g. I need to buy some bread..." class="input input-bordered w-full" bind:value={scenario.text} />
                    </div>
                    
                    <div class="form-control w-full">
                        <label class="label">
                            <span class="label-text font-bold">Hint</span>
                            <span class="label-text-alt">Helpful tip for the student</span>
                        </label>
                        <input type="text" placeholder="e.g. Look for the place that sells food made from flour." class="input input-bordered w-full" bind:value={scenario.hint} />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-200/50 p-4 rounded-xl">
                        <div class="form-control">
                            <label class="label font-bold text-success">Correct Answer</label>
                            <select class="select select-bordered select-success w-full" bind:value={scenario.answer}>
                                {#each PLACES as place}
                                    <option value={place.id}>{place.emoji} {place.label}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-control">
                            <label class="label font-bold text-error">Distractors (Wrong Answers)</label>
                            <div class="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
                                {#each scenario.distractors as distractor, dIndex}
                                    <div class="badge badge-error gap-1 pl-3 pr-1 py-3">
                                        {PLACES.find(p => p.id === distractor)?.label || distractor}
                                        <button class="btn btn-ghost btn-xs btn-circle text-white hover:bg-white/20" on:click={() => removeDistractor(i, dIndex)}>✕</button>
                                    </div>
                                {/each}
                                {#if scenario.distractors.length === 0}
                                    <span class="text-xs opacity-50 italic py-1">No distractors added yet</span>
                                {/if}
                            </div>
                            <select class="select select-bordered select-sm w-full" on:change={(e) => { addDistractor(i, e.target.value); e.target.value = ""; }}>
                                <option value="" disabled selected>+ Add a wrong answer</option>
                                {#each PLACES as place}
                                    {#if place.id !== scenario.answer && !scenario.distractors.includes(place.id)}
                                        <option value={place.id}>{place.emoji} {place.label}</option>
                                    {/if}
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button class="btn btn-ghost btn-sm text-error hover:bg-error/10" on:click={() => deleteScenario(i)}>
                            🗑️ Delete Scenario
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/each}
    </div>

    <button class="btn btn-primary w-full mt-6 shadow-lg" on:click={addScenario}>
        <span class="text-xl">+</span> Add New Scenario
    </button>
  </div>
{:else}
<section class="space-y-4">
  <div class="flex items-center gap-2">
    <button class="btn btn-sm bg-base-100 border-base-300 shadow-sm hover:shadow-md hover:bg-base-200" on:click={() => dispatch('back')} aria-label="Go back">← Back</button>
    <h2 class="text-xl font-semibold">Help the Visitor – Scenarios</h2>
  </div>
  <p class="text-sm opacity-80">
    Read the scenario. Click the correct place.
  </p>

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
          <div class="grid gap-3 mt-4 grid-cols-2 sm:grid-cols-3">
            {#each options as opt (opt.id)}
            <button
              class="btn btn-outline flex flex-col gap-1 h-auto py-4 min-h-[6rem] touch-manipulation hover:scale-[1.02] hover:shadow-md transition-all duration-200"
              class:btn-success={selectedId === opt.id && buttonStatus === 'correct'}
              class:btn-error={selectedId === opt.id && buttonStatus === 'incorrect'}
              on:click={() => selectPlace(opt.id)}
              aria-label={"Select " + opt.label}
            >
              <span class="text-3xl sm:text-4xl mb-1 transform transition-transform group-hover:scale-110">{opt.emoji}</span>
              <span class="text-xs sm:text-sm md:text-base whitespace-normal leading-tight">{opt.label}</span>
            </button>
            {/each}
          </div>
  {/key}
        {#if wrongAttemptsForCurrent >= 1 && current?.hint}
          <div class="alert alert-info mt-4 shadow-sm border-l-4 border-info bg-info/10" in:fade>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h3 class="font-bold text-xs uppercase tracking-wide opacity-70">Hint</h3>
              <div class="text-sm">{current.hint}</div>
            </div>
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
{/if}