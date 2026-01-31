<script>
  import { shortQAStore, teacherMode } from '../stores.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { SHORT_QA_ITEMS } from '../data/shortQA.js';
  import confetti from 'canvas-confetti';

  const dispatch = createEventDispatcher();

  const QUESTIONS_PER_SESSION = 5;

  let items = [];
  let currentIndex = 0;
  let score = 0;
  let attempts = 0;
  let finished = false;
  let selectedId = null;
  let buttonStatus = null; // 'correct' or 'incorrect'

  onMount(() => {
    // Ensure store is a valid array and has items. If not, reset to defaults.
    if (!Array.isArray($shortQAStore) || $shortQAStore.length === 0) {
      $shortQAStore = JSON.parse(JSON.stringify(SHORT_QA_ITEMS));
    }
  });

  function startSession() {
    const shuffled = [...$shortQAStore].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(QUESTIONS_PER_SESSION, $shortQAStore.length));
    
    // Shuffle options for each question so the answer isn't always the first one
    items = selected.map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    }));

    currentIndex = 0;
    score = 0;
    attempts = 0;
    finished = false;
    selectedId = null;
    buttonStatus = null;
  }

  // Re-init if store changes and we have no items (initial load)
  $: if (Array.isArray($shortQAStore) && $shortQAStore.length > 0 && items.length === 0) {
      startSession();
  }

  function selectOption(id) {
    const current = items[currentIndex];
    if (finished || !current) return;

    attempts += 1;
    selectedId = id;

    if (id === current.answer) {
      score += 1;
      buttonStatus = 'correct';
      setTimeout(() => {
        buttonStatus = null;
        selectedId = null;
        if (currentIndex < items.length - 1) {
          currentIndex += 1;
        } else {
          finished = true;
          if (score === items.length) {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
      }, 700);
    } else {
      buttonStatus = 'incorrect';
      setTimeout(() => {
        buttonStatus = null;
        selectedId = null;
      }, 700);
    }
  }

  function restart() {
    startSession();
  }

  // initialize first session
  // startSession(); // Removed, handled by reactive statement

  // Teacher Mode Functions
  function addItem() {
    $shortQAStore = [...$shortQAStore, {
        id: Date.now(),
        question: 'New Question?',
        options: [
            { id: 'a', text: 'Option A' },
            { id: 'b', text: 'Option B' },
            { id: 'c', text: 'Option C' },
            { id: 'd', text: 'Option D' }
        ],
        answer: 'a'
    }];
  }

  function deleteItem(index) {
    const newItems = [...$shortQAStore];
    newItems.splice(index, 1);
    $shortQAStore = newItems;
  }
</script>

{#if $teacherMode}
  <div class="bg-base-100 rounded-2xl shadow-soft p-6 lg:p-8 mb-8 border border-base-200/50">
    <div class="flex items-center justify-between mb-6 pb-5 border-b border-base-200">
        <div class="flex items-center gap-3">
            <button class="btn btn-circle btn-ghost btn-sm hover:bg-base-200" on:click={() => dispatch('back')} aria-label="Go back">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 class="text-xl lg:text-2xl font-bold text-base-content">Q&A Editor</h2>
                <p class="text-sm text-base-content/60">Manage the multiple choice questions.</p>
            </div>
        </div>
        <div class="badge badge-primary font-semibold">{$shortQAStore.length} Questions</div>
    </div>

    <div class="space-y-3">
        {#each $shortQAStore as item, i}
        <div class="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-xl hover:border-base-300 transition-colors">
            <input type="checkbox" /> 
            <div class="collapse-title text-base font-semibold flex items-center gap-3 pr-12">
                <span class="badge badge-neutral badge-sm font-mono">{i + 1}</span>
                <span class="truncate flex-1 text-base-content/90">{item.question || 'New Question'}</span>
            </div>
            <div class="collapse-content bg-base-100 pt-4 border-t border-base-200 rounded-b-xl"> 
                <div class="grid gap-5 p-1">
                    <div class="form-control w-full">
                        <span class="text-sm font-semibold text-base-content/70 mb-1.5">Question Text</span>
                        <input type="text" class="input input-bordered w-full focus:input-primary transition-all" bind:value={item.question} aria-label="Question text" />
                    </div>
                    
                    <div class="bg-base-200/30 p-4 rounded-xl border border-base-200/50">
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                            <span class="font-semibold text-sm">Answer Options</span>
                            <span class="badge badge-info badge-sm font-medium">Select correct answer</span>
                        </div>
                        
                        <div class="grid gap-2">
                            {#each item.options as opt}
                                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200/50 transition-colors cursor-pointer">
                                    <input type="radio" name="correct-{i}" class="radio radio-success radio-sm" checked={item.answer === opt.id} on:change={() => item.answer = opt.id} />
                                    <span class="font-mono font-bold text-sm text-base-content/50 w-5">{opt.id.toUpperCase()}</span>
                                    <input type="text" class="input input-bordered input-sm flex-1" bind:value={opt.text} />
                                </label>
                            {/each}
                        </div>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button class="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-2 font-medium" on:click={() => deleteItem(i)}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/each}
    </div>

    <button class="btn btn-primary w-full mt-6 rounded-xl shadow-sm hover:shadow-md transition-all gap-2 font-semibold" on:click={addItem}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Add New Question
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
        <h2 class="text-xl lg:text-2xl font-bold text-base-content">Short Q&A</h2>
        <p class="text-sm text-base-content/60">Select the most appropriate response.</p>
    </div>
  </div>

  {#if !finished && items.length > 0 && items[currentIndex]}
    <div class="card bg-base-100 shadow-soft overflow-hidden border border-base-200/50">
      <!-- Progress Bar -->
      <div class="h-1 bg-base-200 w-full">
        <div class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out" style="width: {((currentIndex + 1) / items.length) * 100}%"></div>
      </div>
      
      <div class="card-body p-5 sm:p-7 lg:p-8">
        <!-- Progress Indicator -->
        <div class="flex items-center justify-between text-sm mb-5">
          <span class="text-base-content/50 font-medium">Question {currentIndex + 1} of {items.length}</span>
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5 text-success">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <span class="font-semibold">{score}</span>
            </span>
          </div>
        </div>

        <!-- Question Card -->
        <div class="bg-gradient-to-br from-base-200/60 to-base-200/30 p-5 sm:p-6 rounded-2xl border border-base-300/50 mb-6 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent rounded-full"></div>
            <div class="flex gap-4 items-start pl-3">
                <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div class="flex-1">
                    <p class="text-lg sm:text-xl font-semibold leading-relaxed text-base-content" aria-live="polite">{items[currentIndex].question}</p>
                </div>
            </div>
        </div>

        <!-- Answer Options -->
        <div class="grid gap-2.5 sm:grid-cols-2">
          {#each items[currentIndex].options as opt (opt.id)}
            <button
              type="button"
              class="group relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] bg-base-100 text-left
              {selectedId !== opt.id ? 'border-base-200 hover:border-primary/40 hover:bg-primary/5' : ''}
              {selectedId === opt.id && buttonStatus === 'correct' ? 'border-success bg-success/10' : ''}
              {selectedId === opt.id && buttonStatus === 'incorrect' ? 'border-error bg-error/10' : ''}"
              on:click={() => selectOption(opt.id)}
              disabled={buttonStatus !== null}
              aria-label={`Answer option: ${opt.text}`}
            >
              <div class="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center font-bold text-sm text-base-content/50 group-hover:bg-primary group-hover:text-primary-content transition-colors flex-shrink-0
                {selectedId === opt.id && buttonStatus === 'correct' ? 'bg-success text-success-content' : ''}
                {selectedId === opt.id && buttonStatus === 'incorrect' ? 'bg-error text-error-content' : ''}">
                {opt.id.toUpperCase()}
              </div>
              <span class="text-sm sm:text-base font-medium leading-snug flex-1">{opt.text}</span>
              
              {#if selectedId === opt.id && buttonStatus === 'correct'}
                <div class="text-success flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                </div>
              {/if}
              {#if selectedId === opt.id && buttonStatus === 'incorrect'}
                <div class="text-error flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
                </div>
              {/if}
            </button>
          {/each}
        </div>

        <!-- Footer Stats -->
        <div class="mt-6 pt-4 border-t border-base-200 flex justify-between items-center text-sm text-base-content/50">
          <span>Attempts: <span class="font-semibold text-base-content/70">{attempts}</span></span>
        </div>
      </div>
    </div>
  {:else if finished}
    <div class="card bg-base-100 shadow-soft overflow-hidden border border-base-200/50" in:fade>
      <div class="h-1.5 bg-gradient-to-r from-success via-primary to-accent"></div>
      <div class="card-body items-center text-center p-6 sm:p-8 lg:p-10">
        <!-- Success Icon -->
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mb-4 border border-success/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        
        <h3 class="text-2xl sm:text-3xl font-bold mb-2 text-base-content">Well Done!</h3>
        <p class="text-base-content/60 mb-6 max-w-sm">You've completed this practice session.</p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
          <div class="bg-gradient-to-br from-success/10 to-success/5 p-4 rounded-xl border border-success/20">
            <div class="text-xs uppercase font-semibold tracking-wider text-success/70 mb-1">Correct</div>
            <div class="text-2xl font-bold text-success">{score}<span class="text-sm font-normal text-base-content/40">/{items.length}</span></div>
          </div>
          
          <div class="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20">
            <div class="text-xs uppercase font-semibold tracking-wider text-primary/70 mb-1">Accuracy</div>
            <div class="text-2xl font-bold text-primary">{items.length && attempts > 0 ? Math.round((score / attempts) * 100) : 0}<span class="text-sm font-normal">%</span></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
          <button class="btn btn-primary flex-1 gap-2 rounded-xl font-semibold" on:click={restart}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Practice Again
          </button>
          <button class="btn btn-ghost flex-1 gap-2 rounded-xl font-medium" on:click={() => dispatch('back')}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  {:else}
    <div class="card bg-base-100 shadow-soft border border-base-200/50">
        <div class="card-body items-center text-center p-8">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="text-base mt-4 text-base-content/70">Loading questions...</p>
            {#if Array.isArray($shortQAStore) && $shortQAStore.length === 0}
                <p class="text-warning mt-2 text-sm">No questions found. Please add some in Teacher Mode.</p>
            {/if}
        </div>
    </div>
  {/if}
</section>
{/if}
