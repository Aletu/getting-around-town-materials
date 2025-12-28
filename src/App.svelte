<script>
  import HelpVisitor from './components/HelpVisitor.svelte';
  import SafeWalkSequence from './components/SafeWalkSequence.svelte';
  import ShortQA from './components/ShortQA.svelte';
  import LearnPlaces from './components/LearnPlaces.svelte';
  import SettingsModal from './components/SettingsModal.svelte';
  import Toast from './components/Toast.svelte';
  import ucrLogo from './assets/firma-ucr-vertical.svg';
  import { teacherMode, scenariosStore, shortQAStore, safeWalkStore, themeStore, fontSizeStore, reducedMotionStore, dyslexiaFontStore, toastStore } from './stores.js';
  import { SCENARIOS } from './data/scenarios.js';
  import { SHORT_QA_ITEMS } from './data/shortQA.js';
  import { SAFE_WALK_SCENARIOS } from './data/sequenceText.js';
  import { fade, fly } from 'svelte/transition';

  let view = 'home';
  let showSettings = false;

  function setView(id) {
    view = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Ensure we are at the top after the transition
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, 350);
  }

  // Apply settings
  $: {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', $themeStore);
      
      // Reset classes on html/body
      document.documentElement.classList.remove('text-scale-large', 'text-scale-xlarge');
      document.body.classList.remove('font-dyslexic', 'motion-reduce');
      
      // Apply new classes
      if ($fontSizeStore === 'large') document.documentElement.classList.add('text-scale-large');
      if ($fontSizeStore === 'xlarge') document.documentElement.classList.add('text-scale-xlarge');
      
      if ($dyslexiaFontStore) document.body.classList.add('font-dyslexic');
      if ($reducedMotionStore) document.body.classList.add('motion-reduce');
    }
  }

  function resetAll() {
    if(confirm('Are you sure you want to reset all content to the original defaults? This cannot be undone.')) {
        scenariosStore.set(SCENARIOS);
        shortQAStore.set(SHORT_QA_ITEMS);
        safeWalkStore.set(SAFE_WALK_SCENARIOS);
        toastStore.add('All content has been reset to defaults.', 'success');
    }
  }

  function exportData() {
    const data = {
        scenarios: $scenariosStore,
        shortQA: $shortQAStore,
        safeWalk: $safeWalkStore
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'getting-around-town-content.json';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="min-h-screen flex flex-col bg-base-200 font-sans">
<header class="navbar bg-base-100 px-4 shadow-md sticky top-0 z-50">
  <div class="flex-1 flex items-center gap-4">
    <div class="flex items-center gap-2">
        <span class="text-3xl">🏘️</span>
        <span class="font-extrabold text-xl sm:text-2xl text-primary tracking-tight">Getting Around Town!</span>
    </div>
    <div class="hidden sm:flex gap-2 ml-4">
        <button class="btn btn-sm rounded-full px-6" class:btn-primary={view !== 'learn'} class:btn-ghost={view === 'learn'} on:click={() => setView('home')}>Modules</button>
        <button class="btn btn-sm rounded-full px-6" class:btn-primary={view === 'learn'} class:btn-ghost={view !== 'learn'} on:click={() => setView('learn')}>Learn</button>
    </div>
  </div>
  <div class="flex-none flex items-center gap-2">
    <button class="btn btn-ghost btn-circle" on:click={() => showSettings = true} aria-label="Settings">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    </button>
    <!-- Desktop View -->
    <div class="hidden sm:block">
      <label class="label cursor-pointer gap-2 bg-base-200 px-3 py-1 rounded-full hover:bg-base-300 transition-colors">
        <span class="label-text font-bold text-xs uppercase tracking-wider text-base-content/70">Teacher Mode</span> 
        <input type="checkbox" class="toggle toggle-primary toggle-sm" bind:checked={$teacherMode} aria-label="Toggle Teacher Mode" />
      </label>
    </div>

    <!-- Mobile View (Hamburger) -->
    <div class="dropdown dropdown-end sm:hidden">
      <button type="button" class="btn btn-ghost btn-circle" aria-label="Menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-200">
        <li>
          <label class="label cursor-pointer justify-between active:bg-base-200">
            <span class="label-text font-medium">Teacher Mode</span>
            <input type="checkbox" class="toggle toggle-primary toggle-sm" bind:checked={$teacherMode} />
          </label>
        </li>
      </ul>
    </div>
  </div>
</header>
<!-- Mobile Navigation -->
<div class="sm:hidden flex justify-center gap-2 p-2 bg-base-100 border-b shadow-sm sticky top-16 z-40">
    <button class="btn btn-sm flex-1 rounded-full" class:btn-primary={view !== 'learn'} class:btn-ghost={view === 'learn'} on:click={() => setView('home')}>Modules</button>
    <button class="btn btn-sm flex-1 rounded-full" class:btn-primary={view === 'learn'} class:btn-ghost={view !== 'learn'} on:click={() => setView('learn')}>Learn</button>
</div>

<main class="flex-1 p-4 max-w-6xl mx-auto w-full">
  {#if view === 'home'}
    <section class="space-y-12" in:fade={{ duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
      
      <!-- Hero Section -->
      <div class="hero relative rounded-[2.5rem] shadow-2xl border border-base-300/50 isolate">
        <!-- Background with overflow hidden to clip the gradient/pattern but not the content -->
        <div class="absolute inset-0 bg-gradient-to-br from-base-100 to-base-200 rounded-[2.5rem] overflow-hidden -z-10">
            <div class="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        </div>
        
        <div class="hero-content flex-col lg:flex-row-reverse p-8 lg:p-16 gap-12 relative z-10">
          <div class="text-9xl animate-float select-none filter drop-shadow-xl">🗺️</div>
          <div>
            <h1 class="text-5xl lg:text-6xl font-black mb-6 leading-tight">
              <span class="text-gradient">Explore Your</span><br/>
              <span class="text-base-content">Community!</span>
            </h1>
            <p class="py-2 text-xl opacity-80 max-w-xl leading-relaxed mb-8">
              Welcome to <strong>Getting Around Town</strong>! Learn how to navigate your city, help visitors find their way, and stay safe while walking. Choose a fun activity below to get started!
            </p>
            <button class="btn btn-primary btn-lg rounded-full shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-primary/30 border-none bg-gradient-to-r from-primary to-secondary text-white" on:click={() => setView('learn')}>
                Start Learning Places ➜
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 mt-12 mb-8">
        <div class="h-12 w-2 bg-primary rounded-full"></div>
        <h2 class="text-3xl font-bold text-base-content">Interactive Activities</h2>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Help Visitor Card -->
        <article class="card bg-base-100 shadow-xl hover-lift border-t-8 border-primary group overflow-hidden">
          <div class="card-body relative p-8">
            <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-9xl pointer-events-none select-none">💬</div>
            <div class="flex flex-col h-full relative z-10">
              <div class="mb-6">
                <div class="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                    💬
                </div>
                <h2 class="card-title text-2xl font-bold mb-3">Help the Visitor</h2>
                <p class="text-base opacity-70 leading-relaxed">Read scenarios and guide visitors to the right place in town.</p>
              </div>
              
              <div class="mt-auto pt-4">
                <div class="flex flex-wrap gap-2 mb-6">
                    <span class="badge badge-lg badge-ghost">10 Scenarios</span>
                    <span class="badge badge-lg badge-ghost">Scoring</span>
                </div>
                <button class="btn btn-primary w-full rounded-xl shadow-md group-hover:shadow-lg transition-all" on:click={() => setView('help-visitor')}>Play Now</button>
              </div>
            </div>
          </div>
        </article>

        <!-- Safe Walk Card -->
        <article class="card bg-base-100 shadow-xl hover-lift border-t-8 border-secondary group overflow-hidden">
          <div class="card-body relative p-8">
            <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-9xl pointer-events-none select-none">🚦</div>
            <div class="flex flex-col h-full relative z-10">
              <div class="mb-6">
                <div class="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-sm">
                    🚦
                </div>
                <h2 class="card-title text-2xl font-bold mb-3">Safe Walk</h2>
                <p class="text-base opacity-70 leading-relaxed">Order the steps to show a safe walking sequence.</p>
              </div>
              
              <div class="mt-auto pt-4">
                <div class="flex flex-wrap gap-2 mb-6">
                    <span class="badge badge-lg badge-ghost">Drag & Drop</span>
                    <span class="badge badge-lg badge-ghost">Safety</span>
                </div>
                <button class="btn btn-secondary w-full rounded-xl shadow-md group-hover:shadow-lg transition-all" on:click={() => setView('safe-walk')}>Play Now</button>
              </div>
            </div>
          </div>
        </article>

        <!-- Short Q&A Card -->
        <article class="card bg-base-100 shadow-xl hover-lift border-t-8 border-accent group overflow-hidden">
          <div class="card-body relative p-8">
            <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-9xl pointer-events-none select-none">❓</div>
            <div class="flex flex-col h-full relative z-10">
              <div class="mb-6">
                <div class="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                    ❓
                </div>
                <h2 class="card-title text-2xl font-bold mb-3">Short Q&A</h2>
                <p class="text-base opacity-70 leading-relaxed">Choose the best response for everyday questions.</p>
              </div>
              
              <div class="mt-auto pt-4">
                <div class="flex flex-wrap gap-2 mb-6">
                    <span class="badge badge-lg badge-ghost">5 Questions</span>
                    <span class="badge badge-lg badge-ghost">Logic</span>
                </div>
                <button class="btn btn-accent w-full rounded-xl text-white shadow-md group-hover:shadow-lg transition-all" on:click={() => setView('short-qa')}>Play Now</button>
              </div>
            </div>
          </div>
        </article>
      </div>

    </section>
  {:else if view === 'help-visitor'}
    <div in:fly={{ y: 20, duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
        <HelpVisitor on:back={() => setView('home')} />
    </div>
  {:else if view === 'safe-walk'}
    <div in:fly={{ y: 20, duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
        <SafeWalkSequence on:back={() => setView('home')} />
    </div>
  {:else if view === 'short-qa'}
    <div in:fly={{ y: 20, duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
        <ShortQA on:back={() => setView('home')} />
    </div>
  {:else if view === 'learn'}
    <div in:fly={{ y: 20, duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
        <LearnPlaces />
    </div>
  {/if}
</main>

<footer class="mt-12 bg-neutral text-neutral-content">
    <div class="max-w-6xl mx-auto p-10">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="flex items-center gap-6">
            <img src={ucrLogo} alt="University of Costa Rica" class="h-20 w-auto brightness-0 invert opacity-90" />
            <div class="h-12 w-px bg-white/20 hidden md:block"></div>
            <div>
                <p class="font-bold text-lg">TCU-501 Project</p>
                <p class="text-sm opacity-70">Escuela de Lenguas Modernas</p>
            </div>
        </div>
        <div class="flex gap-4">
            <a
            href="https://lenguasmodernas.ucr.ac.cr/tcu-501/"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline btn-sm text-white hover:bg-white hover:text-neutral"
          >
            Visit TCU-501 Website
          </a>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-white/10 text-center text-xs opacity-50">
        <p>&copy; {new Date().getFullYear()} Getting Around Town Materials. All rights reserved.</p>
      </div>
    </div>
</footer>

</div>

{#if $teacherMode}
<div class="fixed bottom-0 left-0 right-0 bg-neutral text-neutral-content p-4 z-50 shadow-lg border-t-4 border-primary" transition:fly={{ y: 100, duration: 300 }}>
    <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
            <div class="badge badge-primary badge-lg gap-2">
                <span>👨‍🏫</span> Teacher Mode Active
            </div>
            <span class="text-sm opacity-80 hidden sm:inline">You are editing the content. Changes are saved automatically.</span>
        </div>
        <div class="flex gap-2">
            <button class="btn btn-sm btn-ghost text-error hover:bg-error/20" on:click={resetAll}>
                Reset Defaults
            </button>
            <button class="btn btn-sm btn-primary" on:click={exportData}>
                Export Content
            </button>
        </div>
    </div>
</div>
{/if}

{#if showSettings}
  <SettingsModal on:close={() => showSettings = false} />
{/if}

<Toast />
