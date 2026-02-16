<script>
  import { teacherMode, scenariosStore, shortQAStore, safeWalkStore } from '../stores.js';
  import { SCENARIOS } from '../data/scenarios.js';
  import { SHORT_QA_ITEMS } from '../data/shortQA.js';
  import { SAFE_WALK_SCENARIOS } from '../data/sequenceText.js';
  import { toastStore } from '../stores.js';

  function resetAllData() {
    $scenariosStore = JSON.parse(JSON.stringify(SCENARIOS));
    $shortQAStore = JSON.parse(JSON.stringify(SHORT_QA_ITEMS));
    $safeWalkStore = JSON.parse(JSON.stringify(SAFE_WALK_SCENARIOS));
    toastStore.add('All data has been reset to defaults!', 'success');
  }
</script>

{#if $teacherMode}
<div class="fixed bottom-0 left-0 right-0 bg-base-100/95 backdrop-blur-md border-t border-base-200 shadow-lg z-40">
  <div class="max-w-6xl mx-auto px-4 py-3">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </div>
        <div>
          <h3 class="font-semibold text-sm text-base-content">Teacher Mode Active</h3>
          <p class="text-xs text-base-content/60">Edit content directly within each module</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2 flex-wrap">
        <span class="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg">
          {$scenariosStore.length} Scenarios
        </span>
        <span class="px-2.5 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-lg">
          {$shortQAStore.length} Q&A Items
        </span>
        <span class="px-2.5 py-1 text-xs font-medium bg-accent/10 text-accent rounded-lg">
          {$safeWalkStore.length} Sequences
        </span>
        
        <button 
          class="btn btn-sm btn-ghost border border-warning/30 text-warning hover:bg-warning/10 ml-2 gap-1.5 rounded-lg"
          on:click={resetAllData}
          aria-label="Reset all data to defaults"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Reset Data
        </button>
      </div>
    </div>
  </div>
</div>
{/if}
