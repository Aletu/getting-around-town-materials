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
  $: if (currentIndex || score || attempts) { persist(); }

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
  <div class="bg-base-100 rounded-2xl shadow-soft p-6 lg:p-8 border border-base-200/50">
    <div class="flex items-center justify-between mb-6 pb-5 border-b border-base-200">
        <div class="flex items-center gap-3">
            <button class="btn btn-circle btn-ghost btn-sm hover:bg-base-200" on:click={() => dispatch('back')} aria-label="Go back">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 class="text-xl lg:text-2xl font-bold text-base-content">Scenario Editor</h2>
                <p class="text-sm text-base-content/60">Manage the questions and answers for the "Help Visitor" module.</p>
            </div>
        </div>
        <div class="badge badge-primary font-semibold">{$scenariosStore.length} Scenarios</div>
    </div>

    <div class="space-y-3">
        {#each $scenariosStore as scenario, i}
        <div class="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-xl hover:border-base-300 transition-colors">
            <input type="checkbox" /> 
            <div class="collapse-title text-base font-semibold flex items-center gap-3 pr-12">
                <span class="badge badge-neutral badge-sm font-mono">{i + 1}</span>
                <span class="truncate flex-1 text-base-content/90">{scenario.text || 'New Scenario'}</span>
                {#if !scenario.text}<span class="badge badge-warning badge-xs">Empty</span>{/if}
            </div>
            <div class="collapse-content bg-base-100 pt-4 border-t border-base-200 rounded-b-xl"> 
                <div class="grid gap-5 p-1">
                    <div class="form-control w-full">
                        <span class="text-sm font-semibold text-base-content/70 mb-1.5">Scenario Text</span>
                        <span class="text-xs text-base-content/50 mb-2">What the visitor says</span>
                        <input type="text" placeholder="e.g. I need to buy some bread..." class="input input-bordered w-full focus:input-primary transition-all" bind:value={scenario.text} aria-label="Scenario text" />
                    </div>
                    
                    <div class="form-control w-full">
                        <span class="text-sm font-semibold text-base-content/70 mb-1.5">Hint</span>
                        <span class="text-xs text-base-content/50 mb-2">Helpful tip for the student</span>
                        <input type="text" placeholder="e.g. Look for the place that sells food made from flour." class="input input-bordered w-full focus:input-primary transition-all" bind:value={scenario.hint} aria-label="Hint" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 bg-base-200/30 p-4 rounded-xl border border-base-200/50">
                        <div class="form-control">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="w-2 h-2 rounded-full bg-success"></div>
                                <span class="text-sm font-semibold text-base-content/70">Correct Answer</span>
                            </div>
                            <select class="select select-bordered w-full focus:select-success transition-all" bind:value={scenario.answer} aria-label="Correct answer">
                                {#each PLACES as place}
                                    <option value={place.id}>{place.emoji} {place.label}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-control">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="w-2 h-2 rounded-full bg-error"></div>
                                <span class="text-sm font-semibold text-base-content/70">Distractors (Wrong Answers)</span>
                            </div>
                            <div class="flex flex-wrap gap-1.5 mb-3 min-h-[2rem]">
                                {#each scenario.distractors as distractor, dIndex}
                                    <div class="badge badge-error gap-1 pl-2.5 pr-1 py-2.5 text-xs">
                                        {PLACES.find(p => p.id === distractor)?.label || distractor}
                                        <button class="btn btn-ghost btn-xs btn-circle hover:bg-white/20" on:click={() => removeDistractor(i, dIndex)} aria-label="Remove distractor">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                {/each}
                                {#if scenario.distractors.length === 0}
                                    <span class="text-xs text-base-content/40 italic py-1">No distractors added yet</span>
                                {/if}
                            </div>
                            <select class="select select-bordered select-sm w-full" on:change={(e) => { addDistractor(i, e.currentTarget.value); e.currentTarget.value = ""; }}>
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
                        <button class="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-2 font-medium" on:click={() => deleteScenario(i)}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete Scenario
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/each}
    </div>

    <button class="btn btn-primary w-full mt-6 rounded-xl shadow-sm hover:shadow-md transition-all gap-2 font-semibold" on:click={addScenario}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Add New Scenario
    </button>
  </div>
{:else}
<section class="space-y-6 max-w-3xl mx-auto" in:fade={{ duration: 300 }}>
  <!-- Header -->
  <div class="flex items-center gap-4">
    <button class="btn btn-circle btn-ghost bg-base-100 shadow-sm hover:shadow-md hover:bg-base-200 transition-all" on:click={() => dispatch('back')} aria-label="Go back">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
    </button>
    <div>
        <h2 class="text-xl lg:text-2xl font-bold text-base-content">Help the Visitor</h2>
        <p class="text-sm text-base-content/60">Read the scenario and guide the visitor.</p>
    </div>
  </div>

  {#if !finished}
    <div class="card bg-base-100 shadow-soft overflow-hidden border border-base-200/50">
      <!-- Progress Bar -->
      <div class="h-1 bg-base-200 w-full">
        <div class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out" style="width: {((currentIndex + 1) / messages.length) * 100}%"></div>
      </div>
      
      <div class="card-body p-5 sm:p-7 lg:p-8">
        <!-- Progress Indicator -->
        <div class="flex items-center justify-between text-sm mb-5">
          <span class="text-base-content/50 font-medium">Scenario {currentIndex + 1} of {messages.length}</span>
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5 text-success">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <span class="font-semibold">{score}</span>
            </span>
          </div>
        </div>
        
        {#key current?.id}
          <!-- Scenario Card -->
          <div class="bg-gradient-to-br from-base-200/60 to-base-200/30 p-5 sm:p-6 rounded-2xl border border-base-300/50 mb-6 relative overflow-hidden" in:fade={{ duration: 300, delay: 150 }}>
            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent rounded-full"></div>
            <div class="flex gap-4 pl-3">
                <div class="text-3xl select-none flex-shrink-0">🗣️</div>
                <div>
                    <h3 class="font-semibold text-xs uppercase text-primary/70 mb-1.5 tracking-wide">Visitor says:</h3>
                    <p class="text-lg sm:text-xl font-medium leading-relaxed text-base-content" aria-live="polite">"{current?.text}"</p>
                </div>
            </div>
          </div>

          <div class="grid gap-4 mt-6 grid-cols-1 sm:grid-cols-3">
            {#each options as opt (opt.id)}
            <button
              class="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95
              {selectedId !== opt.id ? 'border-base-200 bg-base-100 hover:border-primary hover:shadow-lg' : ''}
              {selectedId === opt.id && buttonStatus === 'correct' ? 'border-success bg-success/10 text-success animate-pulse-green' : ''}
              {selectedId === opt.id && buttonStatus === 'incorrect' ? 'border-error bg-error/10 text-error animate-shake' : ''}"
              on:click={() => selectPlace(opt.id)}
              disabled={buttonStatus !== null}
              aria-label={"Select " + opt.label}
            >
              <div class="text-5xl transform transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300 filter drop-shadow-sm">{opt.emoji}</div>
              <span class="font-bold text-lg text-center">{opt.label}</span>
              
              {#if selectedId === opt.id && buttonStatus === 'correct'}
                <div class="absolute top-2 right-2 text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                </div>
              {/if}
              {#if selectedId === opt.id && buttonStatus === 'incorrect'}
                <div class="absolute top-2 right-2 text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
                </div>
              {/if}
            </button>
            {/each}
          </div>
        {/key}
        
        {#if wrongAttemptsForCurrent >= 1 && current?.hint}
          <div class="flex items-start gap-3 mt-6 p-4 bg-info/10 rounded-xl border border-info/20" in:fade>
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-info/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 class="font-semibold text-xs uppercase tracking-wide text-info/70 mb-0.5">Hint</h3>
              <p class="text-sm font-medium text-base-content/80">{current.hint}</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="card bg-base-100 shadow-soft overflow-hidden border border-base-200/50" in:fade>
      <div class="h-1.5 bg-gradient-to-r from-success via-primary to-accent"></div>
      <div class="card-body items-center text-center p-8 sm:p-10">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-success/20 to-primary/10 flex items-center justify-center text-5xl mb-5 shadow-inner">
            🎉
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold mb-2 text-base-content">Great Work!</h3>
        <p class="text-base-content/60 mb-8 max-w-sm">You've completed all the scenarios for this session.</p>
        
        <div class="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
          <div class="bg-gradient-to-br from-success/10 to-success/5 p-5 rounded-2xl border border-success/20 text-center">
            <div class="text-xs uppercase font-semibold text-success/70 mb-1 tracking-wide">Correct</div>
            <div class="text-3xl font-bold text-success">{score}</div>
            <div class="text-xs text-base-content/50">out of {messages.length}</div>
          </div>
          
          <div class="bg-gradient-to-br from-primary/10 to-primary/5 p-5 rounded-2xl border border-primary/20 text-center">
            <div class="text-xs uppercase font-semibold text-primary/70 mb-1 tracking-wide">Accuracy</div>
            <div class="text-3xl font-bold text-primary">{attempts > 0 ? Math.round((score / attempts) * 100) : 0}%</div>
            <div class="text-xs text-base-content/50">{attempts} attempts</div>
          </div>
        </div>

        {#if score === messages.length}
          <div class="flex items-center gap-3 p-4 bg-success/10 rounded-xl border border-success/20 mb-6 w-full max-w-sm">
            <span class="text-2xl">⭐</span>
            <div class="text-left">
                <h3 class="font-semibold text-success">Perfect Score!</h3>
                <p class="text-xs text-base-content/60">You're a navigation expert!</p>
            </div>
          </div>
        {:else if score >= messages.length * 0.8}
          <div class="flex items-center gap-3 p-4 bg-info/10 rounded-xl border border-info/20 mb-6 w-full max-w-sm">
            <span class="text-2xl">👏</span>
            <div class="text-left">
                <h3 class="font-semibold text-info">Excellent!</h3>
                <p class="text-xs text-base-content/60">You know your way around town very well.</p>
            </div>
          </div>
        {:else if score >= messages.length * 0.6}
          <div class="flex items-center gap-3 p-4 bg-warning/10 rounded-xl border border-warning/20 mb-6 w-full max-w-sm">
            <span class="text-2xl">👍</span>
            <div class="text-left">
                <h3 class="font-semibold text-warning">Good effort!</h3>
                <p class="text-xs text-base-content/60">Keep practicing to improve your score.</p>
            </div>
          </div>
        {/if}

        <div class="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button class="btn btn-primary flex-1 rounded-xl gap-2" on:click={restart}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Play Again
          </button>
          <button class="btn btn-ghost flex-1 rounded-xl border border-base-300 hover:bg-base-200" on:click={() => dispatch('back')}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Back Home
          </button>
        </div>
      </div>
    </div>
  {/if}
</section>
{/if}