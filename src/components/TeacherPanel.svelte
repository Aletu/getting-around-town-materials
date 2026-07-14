<script>
  import { teacherMode, scenariosStore, shortQAStore, safeWalkStore, toastStore } from '../stores.js';
  import { SCENARIOS } from '../data/scenarios.js';
  import { SHORT_QA_ITEMS } from '../data/shortQA.js';
  import { SAFE_WALK_SCENARIOS } from '../data/sequenceText.js';
  import { fly } from 'svelte/transition';

  function resetAllData() {
    $scenariosStore = JSON.parse(JSON.stringify(SCENARIOS));
    $shortQAStore = JSON.parse(JSON.stringify(SHORT_QA_ITEMS));
    $safeWalkStore = JSON.parse(JSON.stringify(SAFE_WALK_SCENARIOS));
    toastStore.add('All data has been reset to defaults!', 'success');
  }

  // ---------------------------------------------------------------------
  // Export / import — lets a teacher move their edited content to another
  // device (edits live in localStorage, which is per-browser).
  // ---------------------------------------------------------------------
  const EXPORT_APP_ID = 'getting-around-town';

  let fileInput;

  function exportContent() {
    const payload = {
      app: EXPORT_APP_ID,
      version: 1,
      exportedAt: new Date().toISOString(),
      scenarios: $scenariosStore,
      shortQA: $shortQAStore,
      safeWalk: $safeWalkStore,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `getting-around-town-content-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toastStore.add('Content exported as a JSON file!', 'success');
  }

  function isValidExport(data) {
    if (!data || data.app !== EXPORT_APP_ID) return false;
    if (![data.scenarios, data.shortQA, data.safeWalk].every(Array.isArray)) return false;
    const validScenario = (s) =>
      s && typeof s.text === 'string' && typeof s.answer === 'string' && Array.isArray(s.distractors);
    const validQA = (q) =>
      q && typeof q.question === 'string' && Array.isArray(q.options) && typeof q.answer === 'string';
    const validSeq = (s) => s && typeof s.text === 'string' && Array.isArray(s.sequence);
    return (
      data.scenarios.every(validScenario) &&
      data.shortQA.every(validQA) &&
      data.safeWalk.every(validSeq)
    );
  }

  function importContent(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!isValidExport(data)) {
          toastStore.add('That file is not a valid content export.', 'error');
          return;
        }
        $scenariosStore = data.scenarios;
        $shortQAStore = data.shortQA;
        $safeWalkStore = data.safeWalk;
        toastStore.add('Content imported successfully!', 'success');
      } catch (e) {
        toastStore.add('Could not read that file as JSON.', 'error');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }
</script>

{#if $teacherMode}
<div class="fixed bottom-0 left-0 right-0 bg-base-100/95 backdrop-blur-md border-t border-base-200 shadow-lg z-40" transition:fly={{ y: 60, duration: 300 }}>
  <div class="max-w-6xl mx-auto px-4 py-3">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </div>
        <div>
          <h3 class="font-semibold text-sm text-base-content">Teacher Mode Active</h3>
          <p class="text-xs text-base-content/60">Edit Help the Visitor, Daily Sequences and Short Q&amp;A directly within each module</p>
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
          class="btn btn-sm btn-ghost border border-primary/30 text-primary hover:bg-primary/10 ml-2 gap-1.5 rounded-lg"
          on:click={exportContent}
          aria-label="Export edited content as a JSON file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" /></svg>
          Export
        </button>

        <button
          class="btn btn-sm btn-ghost border border-primary/30 text-primary hover:bg-primary/10 gap-1.5 rounded-lg"
          on:click={() => fileInput.click()}
          aria-label="Import content from a JSON file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 16V4m0 0L8 8m4-4l4 4" /></svg>
          Import
        </button>
        <input
          type="file"
          accept="application/json,.json"
          class="hidden"
          bind:this={fileInput}
          on:change={importContent}
          aria-hidden="true"
          tabindex="-1"
        />

        <button
          class="btn btn-sm btn-ghost border border-warning/30 text-warning hover:bg-warning/10 gap-1.5 rounded-lg"
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
