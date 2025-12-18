<script>
  import HelpVisitor from './components/HelpVisitor.svelte';
  import SafeWalkSequence from './components/SafeWalkSequence.svelte';
  import ShortQA from './components/ShortQA.svelte';
  import LearnPlaces from './components/LearnPlaces.svelte';
  import ucrLogo from './assets/firma-ucr-vertical.svg';
  import { teacherMode, scenariosStore, shortQAStore, safeWalkStore } from './stores.js';
  import { SCENARIOS } from './data/scenarios.js';
  import { SHORT_QA_ITEMS } from './data/shortQA.js';
  import { SAFE_WALK_SCENARIOS } from './data/sequenceText.js';
  import { fade, fly } from 'svelte/transition';

  let view = 'home';
  function setView(id) {
    view = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetAll() {
    if(confirm('Are you sure you want to reset all content to the original defaults? This cannot be undone.')) {
        scenariosStore.set(SCENARIOS);
        shortQAStore.set(SHORT_QA_ITEMS);
        safeWalkStore.set(SAFE_WALK_SCENARIOS);
        alert('All content has been reset.');
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
  <div class="flex-none">
    <!-- Desktop View -->
    <div class="hidden sm:block">
      <label class="label cursor-pointer gap-2 bg-base-200 px-3 py-1 rounded-full hover:bg-base-300 transition-colors">
        <span class="label-text font-bold text-xs uppercase tracking-wider text-base-content/70">Teacher Mode</span> 
        <input type="checkbox" class="toggle toggle-primary toggle-sm" bind:checked={$teacherMode} aria-label="Toggle Teacher Mode" />
      </label>
    </div>

    <!-- Mobile View (Hamburger) -->
    <div class="dropdown dropdown-end sm:hidden">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle" aria-label="Menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
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
    <section class="space-y-8" in:fade={{ duration: 300 }}>
      
      <!-- Hero Section -->
      <div class="hero bg-base-100 rounded-3xl shadow-xl overflow-hidden">
        <div class="hero-content flex-col lg:flex-row-reverse p-8 lg:p-12 gap-8">
          <div class="text-9xl animate-bounce-slow select-none">🗺️</div>
          <div>
            <h1 class="text-4xl lg:text-5xl font-black text-primary mb-4">Explore Your Community!</h1>
            <p class="py-2 text-lg opacity-80 max-w-xl leading-relaxed">
              Welcome to <strong>Getting Around Town</strong>! Learn how to navigate your city, help visitors find their way, and stay safe while walking. Choose a fun activity below to get started!
            </p>
            <button class="btn btn-secondary btn-lg rounded-full mt-6 shadow-lg hover:scale-105 transition-transform hover:shadow-xl" on:click={() => setView('learn')}>
                Start Learning Places ➜
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 mt-8 mb-4">
        <h2 class="text-2xl font-bold text-base-content/80">Interactive Activities</h2>
        <div class="h-1 flex-1 bg-base-300 rounded-full"></div>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <!-- Help Visitor Card -->
        <article class="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-primary group overflow-hidden">
          <div class="card-body relative">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-8xl pointer-events-none">💬</div>
            <div class="flex flex-col h-full">
              <div class="mb-4">
                <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    💬
                </div>
                <h2 class="card-title text-2xl mb-2">Help the Visitor</h2>
                <p class="text-sm opacity-70">Read scenarios and guide visitors to the right place.</p>
              </div>
              
              <div class="mt-auto pt-4">
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="badge badge-ghost">10 Scenarios</span>
                    <span class="badge badge-ghost">Scoring</span>
                </div>
                <button class="btn btn-primary w-full rounded-xl group-hover:btn-active" on:click={() => setView('help-visitor')}>Play Now</button>
              </div>
            </div>
          </div>
        </article>

        <!-- Safe Walk Card -->
        <article class="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-secondary group overflow-hidden">
          <div class="card-body relative">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-8xl pointer-events-none">🚦</div>
            <div class="flex flex-col h-full">
              <div class="mb-4">
                <div class="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    🚦
                </div>
                <h2 class="card-title text-2xl mb-2">Safe Walk</h2>
                <p class="text-sm opacity-70">Order the steps to show a safe walking sequence.</p>
              </div>
              
              <div class="mt-auto pt-4">
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="badge badge-ghost">Drag & Drop</span>
                    <span class="badge badge-ghost">Safety</span>
                </div>
                <button class="btn btn-secondary w-full rounded-xl group-hover:btn-active" on:click={() => setView('safe-walk')}>Play Now</button>
              </div>
            </div>
          </div>
        </article>

        <!-- Short Q&A Card -->
        <article class="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-accent group overflow-hidden">
          <div class="card-body relative">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-8xl pointer-events-none">❓</div>
            <div class="flex flex-col h-full">
              <div class="mb-4">
                <div class="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    ❓
                </div>
                <h2 class="card-title text-2xl mb-2">Short Q&A</h2>
                <p class="text-sm opacity-70">Choose the best response for everyday questions.</p>
              </div>
              
              <div class="mt-auto pt-4">
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="badge badge-ghost">5 Questions</span>
                    <span class="badge badge-ghost">Logic</span>
                </div>
                <button class="btn btn-accent w-full rounded-xl text-white group-hover:btn-active" on:click={() => setView('short-qa')}>Play Now</button>
              </div>
            </div>
          </div>
        </article>
      </div>

    </section>
  {:else if view === 'help-visitor'}
    <div in:fly={{ y: 20, duration: 300, delay: 100 }}>
        <HelpVisitor on:back={() => setView('home')} />
    </div>
  {:else if view === 'safe-walk'}
    <div in:fly={{ y: 20, duration: 300, delay: 100 }}>
        <SafeWalkSequence on:back={() => setView('home')} />
    </div>
  {:else if view === 'short-qa'}
    <div in:fly={{ y: 20, duration: 300, delay: 100 }}>
        <ShortQA on:back={() => setView('home')} />
    </div>
  {:else if view === 'learn'}
    <div in:fly={{ y: 20, duration: 300, delay: 100 }}>
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

<style>
  /* Custom animation for the hero emoji */
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(-5%); }
    50% { transform: translateY(5%); }
  }
  .animate-bounce-slow {
    animation: bounce-slow 3s infinite ease-in-out;
  }
</style>