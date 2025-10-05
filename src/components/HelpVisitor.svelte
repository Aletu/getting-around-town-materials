<script>
  import { HINT_MESSAGES } from '../data/hints.js';
  import { PLACES } from '../data/places.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let currentIndex = 0;
  let score = 0;
  let attempts = 0;
  let finished = false;
  let feedback = '';
  // start with messages shuffled so the same message doesn't always appear first
  let messages = [...HINT_MESSAGES].sort(() => Math.random() - 0.5);

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
      dbgState('selectPlace - wrong');
    }
  }

  function advance() {
    setTimeout(() => {
      feedback = '';
      if (currentIndex < messages.length - 1) {
        currentIndex++;
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
    finished = false;
    feedback = '';
    messages = [...HINT_MESSAGES].sort(() => Math.random() - 0.5);
    dbgState('restart');
  }
</script>

<section class="space-y-4">
  <div class="flex items-center gap-2">
    <button class="btn btn-sm" on:click={() => dispatch('back')} aria-label="Go back">← Back</button>
    <h2 class="text-xl font-semibold">Help the Visitor – Short Text Hints</h2>
  </div>
  <p class="text-sm opacity-80">
    Read the short message. Click the correct place.
  </p>

  {#if !finished}
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        {#key current?.id}
          <p class="font-medium" aria-live="polite">
            <span class="badge badge-info mr-2">Message {currentIndex + 1}/{messages.length}</span>
            {current?.text}
          </p>
          <div class="grid gap-3 mt-4 sm:grid-cols-2 md:grid-cols-3">
            {#each options as opt (opt.id)}
            <button
              class="btn btn-outline flex flex-col gap-1"
              on:click={() => selectPlace(opt.id)}
              aria-label={"Select " + opt.label}
            >
              <span class="text-2xl">{opt.emoji}</span>
              <span class="text-xs">{opt.label}</span>
            </button>
            {/each}
          </div>
  {/key}
        {#if feedback}
          <div class="mt-3 text-sm font-semibold" role="status">{feedback}</div>
        {/if}
        <div class="mt-4 text-xs opacity-70">
          Score: {score} / {messages.length} | Attempts: {attempts}
        </div>
      </div>
    </div>
  {:else}
    <div class="alert alert-success">
      <span>Finished! Final score: {score} / {messages.length} (Attempts: {attempts})</span>
    </div>
    <div class="flex gap-2 mt-4">
      <button class="btn btn-primary btn-sm" on:click={restart}>Restart</button>
      <button class="btn btn-ghost btn-sm" on:click={() => dispatch('back')}>Home</button>
    </div>
  {/if}
</section>