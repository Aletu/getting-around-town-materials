<script>
  import { SAFE_WALK_SEQUENCE } from '../data/sequence.js';
  import { SAFE_WALK_TEXT } from '../data/sequenceText.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let items = SAFE_WALK_SEQUENCE.map(i => ({ ...i })).sort(() => Math.random() - 0.5);
  let feedback = '';
  let completed = false;
  let dragSrcId = null;

  function onDragStart(e, id) {
    dragSrcId = id;
    e.dataTransfer.setData('text/plain', id);
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
    {#each items as item}
      <div
        class="card bg-base-100 shadow cursor-move border border-base-300"
        draggable="true"
        on:dragstart={(e) => onDragStart(e, item.id)}
        on:drop={(e) => onDrop(e, item.id)}
        aria-grabbed={dragSrcId === item.id}
        role="listitem"
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

  {#if feedback}
    <div class="mt-2 text-sm font-semibold" role="status">{feedback}</div>
  {/if}

  {#if completed}
    <div class="alert alert-success mt-4">
      <span>Sequence completed! Great job!</span>
    </div>
  {/if}
</section>  