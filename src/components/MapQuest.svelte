<script>
  import { createEventDispatcher, tick } from 'svelte';
  import { get } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';
  import { shuffle } from '../lib/shuffle.js';
  import { MAP_QUESTS } from '../data/mapQuests.js';
  import { MAP_QUEST_SESSION } from '../config.js';
  import SpeakButton from './SpeakButton.svelte';
  import { progressStore, addStars, awardSticker } from '../stores/progressStore.js';

  const dispatch = createEventDispatcher();
  const GRID_SIZE = 4;

  let sessionScenarios = [];
  let currentIndex = 0;
  let currentScenario;
  let feedback = '';
  let completed = false;
  let scenarioDone = false;
  let wrongId = null;
  let wrongTimer = null;

  function startNewSession() {
    sessionScenarios = shuffle(MAP_QUESTS).slice(0, MAP_QUEST_SESSION);
    currentIndex = 0;
    completed = false;
    loadCurrentScenario();
  }

  function loadCurrentScenario() {
    currentScenario = sessionScenarios[currentIndex];
    feedback = '';
    scenarioDone = false;
    wrongId = null;
    if (wrongTimer) { clearTimeout(wrongTimer); wrongTimer = null; }
  }

  // Initialise the first session on mount
  startNewSession();

  $: startCell = currentScenario?.grid.find(c => c.id === currentScenario.startId);

  function parseCell(id) {
    const m = /^r(\d)c(\d)$/.exec(id);
    return m ? { row: +m[1], col: +m[2] } : null;
  }

  function handleTileClick(cell) {
    if (completed || scenarioDone || cell.type !== 'place') return;

    if (cell.id === currentScenario.correctId) {
      feedback = '✅ You found it!';
      scenarioDone = true;
      setTimeout(() => {
        if (currentIndex < sessionScenarios.length - 1) {
          currentIndex += 1;
          loadCurrentScenario();
        } else {
          completed = true;
        }
      }, 700);
    } else {
      feedback = '❌ Not quite. Try again.';
      wrongId = cell.id;
      if (wrongTimer) clearTimeout(wrongTimer);
      wrongTimer = setTimeout(() => { wrongId = null; }, 600);
    }
  }

  async function handleKeydown(event, cell) {
    if (completed || scenarioDone) return;
    const { row, col } = parseCell(cell.id) ?? { row: 0, col: 0 };

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTileClick(cell);
      return;
    }

    let dr = 0, dc = 0;
    switch (event.key) {
      case 'ArrowUp':    dr = -1; break;
      case 'ArrowDown':  dr =  1; break;
      case 'ArrowLeft':  dc = -1; break;
      case 'ArrowRight': dc =  1; break;
      default: return;
    }
    event.preventDefault();

    // Step through cells in the chosen direction until we find a place tile
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      const next = currentScenario.grid.find(g => g.id === `r${r}c${c}`);
      if (next && next.type === 'place') {
        await tick();
        const btn = document.querySelector(`[data-cell-id="${next.id}"]`);
        if (btn instanceof HTMLElement) btn.focus();
        return;
      }
      r += dr;
      c += dc;
    }
  }

  function restart() {
    startNewSession();
  }

  function awardMapQuestProgress(_node) {
    addStars('mapQuest', 3);
    progressStore.update(p => {
      const prev = p.mapQuest ?? { scenariosCompleted: 0, perfectRoutes: 0, totalAttempts: 0 };
      return {
        ...p,
        mapQuest: {
          scenariosCompleted: prev.scenariosCompleted + MAP_QUEST_SESSION,
          perfectRoutes: prev.perfectRoutes + MAP_QUEST_SESSION,
          totalAttempts: prev.totalAttempts + 1
        }
      };
    });
    awardSticker('firstAdventure');
    if ((get(progressStore).mapQuest?.totalAttempts ?? 0) >= 3) {
      awardSticker('mapMaster');
    }
    return {};
  }
</script>

<section class="space-y-6 max-w-3xl mx-auto" in:fade={{ duration: 300 }}>
  <div class="flex items-center gap-4">
    <button class="btn btn-circle btn-ghost bg-base-100 shadow-sm hover:shadow-md hover:bg-base-200 transition-all" on:click={() => dispatch('back')} aria-label="Go back">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
    </button>
    <div>
      <h2 class="text-xl lg:text-2xl font-bold text-base-content">Map Quest</h2>
      <p class="text-sm text-base-content/60">Follow the directions and tap the right place.</p>
    </div>
  </div>

  {#if !completed && currentScenario}
    <div class="card bg-base-100 shadow-soft overflow-hidden border border-base-200/50">
      <div class="h-1 bg-base-200 w-full">
        <div class="h-full bg-gradient-to-r from-success to-info transition-all duration-500 ease-out" style="width: {((currentIndex + 1) / sessionScenarios.length) * 100}%"></div>
      </div>

      <div class="card-body p-4 sm:p-6 lg:p-8">
        <div class="flex items-center justify-between text-sm mb-4">
          <span class="text-base-content/50 font-medium">Quest {currentIndex + 1} of {sessionScenarios.length}</span>
        </div>

        <div class="bg-gradient-to-br from-base-200/60 to-base-200/30 p-4 sm:p-6 rounded-2xl border border-base-300/50 mb-4 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-success to-info rounded-full"></div>
          <div class="pl-3">
            <div class="flex items-center justify-between mb-1.5">
              <h3 class="font-semibold text-xs uppercase text-success/80 tracking-wide">Directions:</h3>
              <SpeakButton text={currentScenario.text} label="Listen to directions" size="sm" />
            </div>
            <p class="text-base sm:text-lg font-medium leading-relaxed text-base-content">{currentScenario.text}</p>
          </div>
        </div>

        {#if startCell}
          <div class="flex items-center justify-center gap-2 mb-3 text-sm">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
              <span aria-hidden="true">📍</span>
              You are at the <strong>{startCell.label}</strong> {startCell.emoji}
            </span>
          </div>
        {/if}

        <div
          class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-2 text-xs"
          role="img"
          aria-label="Compass: north is up, east is right, south is down, west is left"
        >
          <span class="font-bold uppercase tracking-wide text-[10px] text-base-content/50">🧭 Compass</span>
          <span class="inline-flex items-center gap-1.5 font-semibold text-info">
            <span>↑ N</span>
            <span class="text-base-content/30" aria-hidden="true">·</span>
            <span>→ E</span>
            <span class="text-base-content/30" aria-hidden="true">·</span>
            <span>↓ S</span>
            <span class="text-base-content/30" aria-hidden="true">·</span>
            <span>← W</span>
          </span>
        </div>

        <p class="text-xs sm:text-sm text-base-content/60 text-center mb-3">
          💡 Tap the place you reach. <span class="hidden sm:inline">Use <kbd class="kbd kbd-xs">↑↓←→</kbd> to move between places.</span>
        </p>

        <div class="mx-auto w-full max-w-[20rem] sm:max-w-sm">
          <div
            class="grid grid-cols-4 gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-2xl bg-base-200/50 border border-base-300/40"
            role="group"
            aria-label="Town map. Tap a place tile to choose your destination."
          >
            {#each currentScenario.grid as cell (cell.id)}
              {#if cell.type === 'place'}
                <button
                  type="button"
                  data-cell-id={cell.id}
                  class="aspect-square rounded-xl bg-base-100 border-2 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-1 min-h-[60px] sm:min-h-[68px]
                    {cell.id === currentScenario.startId ? 'border-primary ring-2 ring-primary/30 animate-pulse' : 'border-base-300/60 hover:border-success/60 hover:bg-success/5 active:scale-95'}
                    {wrongId === cell.id ? '!border-error !bg-error/15 animate-shake' : ''}
                    {scenarioDone && cell.id === currentScenario.correctId ? '!border-success !bg-success/15 ring-4 ring-success/30' : ''}"
                  on:click={() => handleTileClick(cell)}
                  on:keydown={(e) => handleKeydown(e, cell)}
                  aria-label="{cell.label}{cell.id === currentScenario.startId ? ', you are here' : ''}"
                >
                  <span class="text-2xl sm:text-3xl drop-shadow-sm" aria-hidden="true">{cell.emoji}</span>
                  <span class="text-[10px] sm:text-xs font-medium text-base-content/70 leading-tight text-center px-0.5 truncate w-full">{cell.label}</span>
                </button>
              {:else}
                <div
                  class="aspect-square rounded-xl bg-base-300/30 border border-dashed border-base-300/50 flex items-center justify-center min-h-[60px] sm:min-h-[68px]"
                  aria-hidden="true"
                >
                  <span class="text-base-content/20 text-lg">·</span>
                </div>
              {/if}
            {/each}
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-base-200/50">
          <button class="btn btn-ghost flex-1 rounded-xl border border-base-300 gap-2" on:click={restart}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            New Session
          </button>
        </div>

        {#if feedback}
          <div
            class="mt-5 p-3 sm:p-4 rounded-xl text-center font-semibold border
              {feedback.includes('found') ? 'bg-success/10 text-success border-success/20' : ''}
              {feedback.includes('Not') ? 'bg-error/10 text-error border-error/20' : ''}"
            in:fly={{ y: 10, duration: 250 }}
            role="status"
            aria-live="polite"
          >
            {feedback}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if completed}
    <div class="card bg-base-100 shadow-soft overflow-hidden border border-base-200/50" in:fly={{ y: 20, duration: 350 }} use:awardMapQuestProgress>
      <div class="h-1.5 bg-gradient-to-r from-success via-info to-primary"></div>
      <div class="card-body items-center text-center p-6 sm:p-10">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-success/20 to-info/10 flex items-center justify-center text-5xl mb-5 shadow-inner animate-celebrate">
          🗺️
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold mb-2 text-base-content">Quest Complete!</h3>
        <p class="text-base-content/60 mb-4 max-w-sm">You followed the directions and found every place on the map.</p>

        <div class="flex items-center justify-center gap-1 mb-6">
          <span class="text-4xl animate-star-burst" style="animation-delay: 100ms;">⭐</span>
          <span class="text-4xl animate-star-burst" style="animation-delay: 200ms;">⭐</span>
          <span class="text-4xl animate-star-burst" style="animation-delay: 300ms;">⭐</span>
        </div>

        <div class="flex items-center gap-3 p-4 bg-success/10 rounded-xl border border-success/20 mb-6 w-full max-w-sm">
          <span class="text-2xl">🗺️</span>
          <div class="text-left">
            <h3 class="font-semibold text-success">Map Master!</h3>
            <p class="text-xs text-base-content/60">You read the map like a true explorer. +3 stars</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button class="btn btn-success flex-1 rounded-xl gap-2 text-success-content" on:click={restart}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Play Again
          </button>
          <button class="btn btn-ghost flex-1 rounded-xl border border-base-300 hover:bg-base-200 gap-2" on:click={() => dispatch('back')}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Back Home
          </button>
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  :global(.animate-shake) {
    animation: shake 0.35s ease-in-out;
  }
</style>
