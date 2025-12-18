<script>
  import { shortQAStore, teacherMode } from '../stores.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { SHORT_QA_ITEMS } from '../data/shortQA.js';

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
<section class="space-y-4">
  <div class="flex items-center gap-2">
    <button class="btn btn-sm bg-base-100 border-base-300 shadow-sm hover:shadow-md hover:bg-base-200" on:click={() => dispatch('back')} aria-label="Go back">← Back</button>
    <h2 class="text-xl font-semibold">Short Q&A – Step-by-step directions</h2>
  </div>
  <p class="text-sm opacity-80">
    Read the question and choose the answer that makes the most sense.
  </p>

  {#if !finished && items.length > 0 && items[currentIndex]}
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

        <p class="mt-2 text-base-content text-base md:text-lg leading-relaxed" aria-live="polite">{items[currentIndex].question}</p>

        <div class="grid gap-3 mt-4 sm:grid-cols-2">
          {#each items[currentIndex].options as opt (opt.id)}
            <button
              type="button"
              class="btn btn-outline justify-start flex gap-3 h-auto py-3 min-h-[3.5rem] text-left touch-manipulation hover:scale-[1.01] hover:shadow-md transition-all duration-200"
              class:btn-success={selectedId === opt.id && buttonStatus === 'correct'}
              class:btn-error={selectedId === opt.id && buttonStatus === 'incorrect'}
              on:click={() => selectOption(opt.id)}
              aria-label={`Answer option: ${opt.text}`}
            >
              <span class="whitespace-normal leading-snug">{opt.text}</span>
            </button>
          {/each}
        </div>

        <div class="mt-4 text-xs opacity-70">
          Score: {score} / {items.length} | Attempts: {attempts}
        </div>
      </div>
    </div>
  {:else if finished}
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
  {:else}
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
            <p class="text-lg">Loading questions...</p>
            {#if Array.isArray($shortQAStore) && $shortQAStore.length === 0}
                <p class="text-warning">No questions found. Please add some in Teacher Mode.</p>
            {/if}
        </div>
    </div>
  {/if}
</section>
{/if}
