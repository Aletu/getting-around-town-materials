<script>
  import { teacherMode, scenariosStore, shortQAStore, safeWalkStore } from '../stores.js';
  import { SCENARIOS } from '../data/scenarios.js';
  import { SHORT_QA_ITEMS } from '../data/shortQA.js';
  import { SAFE_WALK_SCENARIOS } from '../data/sequenceText.js';
  import { toastStore } from '../stores.js';

  function resetAllData() {
    $scenariosStore = [...SCENARIOS];
    $shortQAStore = [...SHORT_QA_ITEMS];
    $safeWalkStore = [...SAFE_WALK_SCENARIOS];
    toastStore.add('All data has been reset to defaults!', 'success');
  }
</script>

{#if $teacherMode}
<div class="fixed bottom-0 left-0 right-0 bg-base-100 border-t-2 border-primary shadow-lg z-40">
  <div class="max-w-6xl mx-auto px-4 py-3">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">👨‍🏫</span>
        <div>
          <h3 class="font-bold text-sm">Teacher Mode Active</h3>
          <p class="text-xs opacity-70">Edit content directly within each module</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <div class="badge badge-primary badge-outline">
          {$scenariosStore.length} Scenarios
        </div>
        <div class="badge badge-secondary badge-outline">
          {$shortQAStore.length} Q&A Items
        </div>
        <div class="badge badge-accent badge-outline">
          {$safeWalkStore.length} Sequences
        </div>
        
        <button 
          class="btn btn-sm btn-warning btn-outline ml-2"
          on:click={resetAllData}
          aria-label="Reset all data to defaults"
        >
          🔄 Reset Data
        </button>
      </div>
    </div>
  </div>
</div>
{/if}
