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
  <div class="bg-base-100 rounded-box shadow-lg p-6 mb-8 border border-base-300">
    <div class="flex items-center justify-between mb-6 border-b pb-4">
        <div class="flex items-center gap-3">
            <button class="btn btn-circle btn-ghost btn-sm" on:click={() => dispatch('back')} aria-label="Go back">
                <span class="text-xl">←</span>
            </button>
            <div>
                <h2 class="text-2xl font-bold text-base-content">Q&A Editor</h2>
                <p class="text-sm opacity-60">Manage the multiple choice questions.</p>
            </div>
        </div>
        <div class="badge badge-primary badge-outline">{$shortQAStore.length} Questions</div>
    </div>

    <div class="space-y-3">
        {#each $shortQAStore as item, i}
        <div class="collapse collapse-arrow bg-base-200 border border-base-300 rounded-box">
            <input type="checkbox" /> 
            <div class="collapse-title text-lg font-medium flex items-center gap-3">
                <span class="badge badge-neutral">{i + 1}</span>
                <span class="truncate flex-1">{item.question || 'New Question'}</span>
            </div>
            <div class="collapse-content bg-base-100 pt-4 border-t border-base-200"> 
                <div class="grid gap-4">
                    <div class="form-control w-full">
                        <div class="label font-bold">Question Text</div>
                        <input type="text" class="input input-bordered w-full" bind:value={item.question} aria-label="Question text" />
                    </div>
                    
                    <div class="bg-base-200/50 p-4 rounded-xl">
                        <div class="flex justify-between items-center mb-2">
                            <div class="label font-bold">Answer Options</div>
                            <div class="badge badge-info badge-outline">Select the correct answer below</div>
                        </div>
                        
                        <div class="grid gap-3">
                            {#each item.options as opt}
                                <div class="flex items-center gap-2">
                                    <input type="radio" name="correct-{i}" class="radio radio-success" checked={item.answer === opt.id} on:change={() => item.answer = opt.id} />
                                    <span class="font-mono font-bold opacity-50 w-6">{opt.id}</span>
                                    <input type="text" class="input input-bordered input-sm flex-1" bind:value={opt.text} />
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button class="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-2" on:click={() => deleteItem(i)}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete Question
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/each}
    </div>

    <button class="btn btn-primary w-full mt-6 shadow-lg" on:click={addItem}>
        <span class="text-xl">+</span> Add New Question
    </button>
  </div>
{:else}
<section class="space-y-6 max-w-4xl mx-auto" in:fade={{ duration: 300 }}>
  <div class="flex items-center gap-4">
    <button class="btn btn-circle btn-ghost bg-base-100 shadow-sm hover:shadow-md hover:bg-base-200 transition-all" on:click={() => dispatch('back')} aria-label="Go back">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
    </button>
    <div>
        <h2 class="text-2xl font-bold text-base-content">Short Q&A</h2>
        <p class="text-sm text-base-content/60">Select the most appropriate response to each question.</p>
    </div>
  </div>

  {#if !finished && items.length > 0 && items[currentIndex]}
    <div class="card bg-base-100 shadow-xl overflow-hidden">
      <div class="h-1.5 bg-base-200 w-full">
        <div class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style="width: {((currentIndex + 1) / items.length) * 100}%"></div>
      </div>
      <div class="card-body p-6 sm:p-8">
        <div class="flex items-center justify-between text-sm mb-6">
          <span class="font-medium text-base-content/60">Progress</span>
          <span class="font-semibold text-primary">{currentIndex + 1} of {items.length}</span>
        </div>

        <div class="bg-gradient-to-br from-base-200/70 to-base-200/30 p-6 rounded-2xl border border-base-300 mb-8 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent"></div>
            <div class="flex gap-4 items-start">
                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div class="flex-1">
                    <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Question {currentIndex + 1}</span>
                    <p class="text-xl md:text-2xl font-medium leading-relaxed text-base-content" aria-live="polite">{items[currentIndex].question}</p>
                </div>
            </div>
        </div>

        <div class="grid gap-3 mt-4 sm:grid-cols-2">
          {#each items[currentIndex].options as opt (opt.id)}
            <button
              type="button"
              class="group relative flex items-center gap-4 p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] bg-base-100 text-left
              {selectedId !== opt.id ? 'border-base-200 hover:border-primary/50 hover:bg-base-200/30' : ''}
              {selectedId === opt.id && buttonStatus === 'correct' ? 'border-success bg-success/10' : ''}
              {selectedId === opt.id && buttonStatus === 'incorrect' ? 'border-error bg-error/10' : ''}"
              on:click={() => selectOption(opt.id)}
              disabled={buttonStatus !== null}
              aria-label={`Answer option: ${opt.text}`}
            >
              <div class="w-9 h-9 rounded-lg bg-base-200 flex items-center justify-center font-semibold text-sm text-base-content/50 group-hover:bg-primary group-hover:text-primary-content transition-colors
                {selectedId === opt.id && buttonStatus === 'correct' ? 'bg-success text-success-content' : ''}
                {selectedId === opt.id && buttonStatus === 'incorrect' ? 'bg-error text-error-content' : ''}">
                {opt.id.toUpperCase()}
              </div>
              <span class="text-base sm:text-lg font-medium leading-snug flex-1">{opt.text}</span>
              
              {#if selectedId === opt.id && buttonStatus === 'correct'}
                <div class="text-success flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                </div>
              {/if}
              {#if selectedId === opt.id && buttonStatus === 'incorrect'}
                <div class="text-error flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
                </div>
              {/if}
            </button>
          {/each}
        </div>

        <div class="mt-8 pt-5 border-t border-base-200 flex justify-between items-center text-sm">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span class="text-base-content/60">Correct: <span class="font-semibold text-success">{score}</span></span>
          </div>
          <span class="text-base-content/50">Attempts: <span class="font-medium text-base-content/70">{attempts}</span></span>
        </div>
      </div>
    </div>
  {:else if finished}
    <div class="card bg-base-100 shadow-xl overflow-hidden" in:fade>
      <div class="h-2 bg-gradient-to-r from-success via-primary to-accent"></div>
      <div class="card-body items-center text-center p-8 md:p-10">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 class="text-2xl md:text-3xl font-bold mb-2">Well Done!</h3>
        <p class="text-base opacity-70 mb-8 max-w-sm">You've completed this practice session.</p>

        <div class="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
          <div class="bg-gradient-to-br from-success/10 to-success/5 p-5 rounded-2xl border border-success/20">
            <div class="text-xs uppercase font-semibold tracking-wider text-success/70 mb-1">Correct</div>
            <div class="text-3xl font-bold text-success">{score}<span class="text-base font-normal text-base-content/50">/{items.length}</span></div>
          </div>
          
          <div class="bg-gradient-to-br from-primary/10 to-primary/5 p-5 rounded-2xl border border-primary/20">
            <div class="text-xs uppercase font-semibold tracking-wider text-primary/70 mb-1">Accuracy</div>
            <div class="text-3xl font-bold text-primary">{items.length ? Math.round((score / attempts) * 100) : 0}<span class="text-base font-normal">%</span></div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button class="btn btn-primary flex-1 gap-2" on:click={restart}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Practice Again
          </button>
          <button class="btn btn-ghost flex-1 gap-2" on:click={() => dispatch('back')}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  {:else}
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="text-lg mt-4">Loading questions...</p>
            {#if Array.isArray($shortQAStore) && $shortQAStore.length === 0}
                <p class="text-warning mt-2">No questions found. Please add some in Teacher Mode.</p>
            {/if}
        </div>
    </div>
  {/if}
</section>
{/if}
