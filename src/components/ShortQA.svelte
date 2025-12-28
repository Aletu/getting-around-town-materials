<script>
  import { shortQAStore, teacherMode } from '../stores.js';
  import { createEventDispatcher, onMount } from 'svelte';
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
                        <label class="label font-bold">Question Text</label>
                        <input type="text" class="input input-bordered w-full" bind:value={item.question} />
                    </div>
                    
                    <div class="bg-base-200/50 p-4 rounded-xl">
                        <div class="flex justify-between items-center mb-2">
                            <label class="label font-bold">Answer Options</label>
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
                        <button class="btn btn-ghost btn-sm text-error hover:bg-error/10" on:click={() => deleteItem(i)}>
                            🗑️ Delete Question
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
    <button class="btn btn-circle btn-ghost bg-base-100 shadow-sm hover:shadow-md hover:bg-base-200 hover:scale-105 transition-all" on:click={() => dispatch('back')} aria-label="Go back">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
    </button>
    <div>
        <h2 class="text-2xl font-bold text-base-content">Short Q&A</h2>
        <p class="text-sm opacity-70">Choose the best response.</p>
    </div>
  </div>

  {#if !finished && items.length > 0 && items[currentIndex]}
    <div class="card bg-base-100 shadow-xl border-t-4 border-accent">
      <div class="card-body p-6 sm:p-8">
        <div class="mb-6 space-y-2">
          <div class="flex items-center justify-between text-sm font-bold uppercase tracking-wider opacity-60">
            <span>Progress</span>
            <span>{currentIndex + 1} / {items.length}</span>
          </div>
          <progress
            class="progress progress-accent w-full h-3 rounded-full bg-base-200"
            value={currentIndex + 1}
            max={items.length}
            aria-label={`Question progress: ${currentIndex + 1} of ${items.length}`}
          ></progress>
        </div>

        <div class="bg-base-200/50 p-6 rounded-2xl border border-base-200 mb-8 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-accent"></div>
            <div class="flex gap-4">
                <div class="text-4xl select-none">❓</div>
                <div>
                    <h3 class="font-bold text-sm uppercase text-accent mb-1">Question:</h3>
                    <p class="text-xl md:text-2xl font-medium leading-relaxed text-base-content/90" aria-live="polite">{items[currentIndex].question}</p>
                </div>
            </div>
        </div>

        <div class="grid gap-4 mt-4 sm:grid-cols-2">
          {#each items[currentIndex].options as opt (opt.id)}
            <button
              type="button"
              class="group relative flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] active:scale-95 bg-base-100 text-left
              {selectedId !== opt.id ? 'border-base-200 hover:border-accent hover:shadow-md' : ''}
              {selectedId === opt.id && buttonStatus === 'correct' ? 'border-success bg-success/10 text-success animate-pulse-green' : ''}
              {selectedId === opt.id && buttonStatus === 'incorrect' ? 'border-error bg-error/10 text-error animate-shake' : ''}"
              on:click={() => selectOption(opt.id)}
              disabled={buttonStatus !== null}
              aria-label={`Answer option: ${opt.text}`}
            >
              <div class="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center font-bold text-sm opacity-50 group-hover:bg-accent group-hover:text-white group-hover:opacity-100 transition-colors">
                {opt.id.toUpperCase()}
              </div>
              <span class="text-lg font-medium leading-snug flex-1">{opt.text}</span>
              
              {#if selectedId === opt.id && buttonStatus === 'correct'}
                <div class="text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                </div>
              {/if}
              {#if selectedId === opt.id && buttonStatus === 'incorrect'}
                <div class="text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
                </div>
              {/if}
            </button>
          {/each}
        </div>

        <div class="mt-8 pt-6 border-t border-base-200 flex justify-between items-center text-sm font-medium opacity-60">
          <span>Score: <span class="text-accent">{score}</span></span>
          <span>Attempts: {attempts}</span>
        </div>
      </div>
    </div>
  {:else if finished}
    <div class="card bg-base-100 shadow-xl border-t-4 border-success" in:fade>
      <div class="card-body items-center text-center p-10">
        <div class="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-6xl mb-6 animate-bounce-slow">
            🌟
        </div>
        <h3 class="text-3xl font-black mb-3">Nice work!</h3>
        <p class="text-lg opacity-70 mb-8 max-w-md">You answered all questions in this short Q&A session.</p>

        <div class="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
          <div class="bg-base-200/50 p-4 rounded-2xl">
            <div class="text-sm uppercase font-bold opacity-60 mb-1">Correct</div>
            <div class="text-3xl font-black text-success">{score}</div>
            <div class="text-xs opacity-60">out of {items.length}</div>
          </div>
          
          <div class="bg-base-200/50 p-4 rounded-2xl">
            <div class="text-sm uppercase font-bold opacity-60 mb-1">Accuracy</div>
            <div class="text-3xl font-black text-accent">{items.length ? Math.round((score / attempts) * 100) : 0}%</div>
            <div class="text-xs opacity-60">{attempts} attempts</div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button class="btn btn-primary flex-1 rounded-xl shadow-lg hover:scale-105 transition-transform" on:click={restart}>
            <span class="text-lg mr-1">🔄</span>
            Try Another Set
          </button>
          <button class="btn btn-outline flex-1 rounded-xl hover:bg-base-200" on:click={() => dispatch('back')}>
            <span class="text-lg mr-1">🏠</span>
            Back Home
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
