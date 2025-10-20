<script>
  import { SAFE_WALK_SEQUENCE } from '../data/sequence.js';
  import { SAFE_WALK_TEXT } from '../data/sequenceText.js';
  import { createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';

  const dispatch = createEventDispatcher();
  let items = SAFE_WALK_SEQUENCE.map(i => ({ ...i })).sort(() => Math.random() - 0.5);
  let feedback = '';
  let completed = false;
  let dragSrcId = null;

  function onDragStart(e, id) {
    dragSrcId = id;
    // prefer move and set drag image to make dragging feel native
    try {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', id);
    } catch (err) {
      // some browsers may throw when customizing dataTransfer; ignore
    }
  }
  function onDragEnd() {
    // clear dragging state so styles/aria update
    dragSrcId = null;
  }
  function onDragOver(e) {
    e.preventDefault();
  }
  function onDrop(e, targetId) {
    e.preventDefault();
    const sourceId = dragSrcId || e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) return;
    const sourceIndex = items.findIndex(i => i.id === sourceId);
    const targetIndex = items.findIndex(i => i.id === targetId);
    [items[sourceIndex], items[targetIndex]] = [items[targetIndex], items[sourceIndex]];
    // trigger list update and let animate:flip handle smooth reorder
    items = [...items];
    dragSrcId = null;
    feedback = '';
  }
  function checkOrder() {
    const isCorrect = items.every((it, idx) => it.correctIndex === idx);
    if (isCorrect) { feedback = '✅ Correct sequence!'; completed = true; }
    else feedback = '❌ Not yet. Try again.';
  }
  function restart() {
    items = SAFE_WALK_SEQUENCE.map(i => ({ ...i })).sort(() => Math.random() - 0.5);
    feedback = '';
    completed = false;
  }
</script>

<section class="space-y-4">
  <div class="flex items-center gap-2">
    <button class="btn btn-sm" on:click={() => dispatch('back')} aria-label="Go back">← Back</button>
    <h2 class="text-xl font-semibold">Safe Walk Sequence</h2>
  </div>
  <p class="text-sm opacity-80">
    Read the short text. Arrange the images in the correct order.
  </p>

  <div class="bg-base-200 p-4 rounded-lg text-sm leading-snug">
    {#each SAFE_WALK_TEXT as line, i}
      <div><span class="font-semibold">Step {i + 1}:</span> {line}</div>
    {/each}
  </div>

  <!-- container has a role/list semantics so the dragover handler has an explicit ARIA role -->
  <div class="grid md:grid-cols-3 gap-4" on:dragover={onDragOver} role="list" aria-label="Safe walk sequence list">
    {#each items as item (item.id)}
      <div
        class="card bg-base-100 shadow cursor-move border border-base-300"
        draggable="true"
        on:dragstart={(e) => onDragStart(e, item.id)}
        on:dragend={onDragEnd}
        on:drop={(e) => onDrop(e, item.id)}
  aria-grabbed={dragSrcId === item.id}
  role="listitem"
  class:dragging={dragSrcId === item.id}
    animate:flip={{ duration: 160 }}
      >
        <div class="card-body items-center p-4">
          <span class="text-5xl" aria-hidden="true">{item.emoji}</span>
          <span class="text-xs mt-2">{item.label}</span>
        </div>
      </div>
    {/each}
  </div>

  <div class="flex gap-2">
    <button class="btn btn-primary btn-sm" on:click={checkOrder} disabled={completed}>Check Order</button>
    <button class="btn btn-outline btn-sm" on:click={restart}>Shuffle</button>
  </div>

  {#if feedback && !completed}
    <div class="mt-2 text-sm font-semibold" role="status">{feedback}</div>
  {/if}

  {#if completed}
    <div class="card bg-base-100 shadow-xl mt-6">
      <div class="card-body items-center text-center">
        <div class="text-6xl mb-4 animate-bounce">🎊</div>
        <h3 class="text-2xl font-bold mb-2">Perfect Sequence!</h3>
        <p class="text-sm opacity-80 mb-4">You successfully arranged all the steps in the correct order</p>
        
        <div class="flex flex-wrap gap-2 justify-center mb-4">
          {#each items as item, i}
            <div class="badge badge-lg badge-success gap-2">
              <span>{item.emoji}</span>
              <span class="text-xs">{i + 1}</span>
            </div>
          {/each}
        </div>

        <div class="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="text-sm">You've demonstrated understanding of safe walking procedures!</span>
        </div>

        <div class="flex gap-3">
          <button class="btn btn-primary" on:click={restart}>
            <span class="text-lg mr-1">🔄</span>
            Try Again
          </button>
          <button class="btn btn-ghost" on:click={() => dispatch('back')}>
            <span class="text-lg mr-1">🏠</span>
            Back Home
          </button>
        </div>
      </div>
    </div>
  {/if}
</section>  

<style>
  /* smooth transitions for reorder and dragged item */
  .card {
     transition: transform 160ms cubic-bezier(.2,.9,.3,1), box-shadow 160ms ease, opacity 120ms ease;
  }
  .card.dragging {
     transform: scale(1.035) translateZ(0);
     box-shadow: 0 10px 22px rgba(0,0,0,0.14);
     opacity: 0.985;
  }
</style>