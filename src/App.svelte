<script>
  import HelpVisitor from './components/HelpVisitor.svelte';
  import SafeWalkSequence from './components/SafeWalkSequence.svelte';
  import ShortQA from './components/ShortQA.svelte';
  import LearnPlaces from './components/LearnPlaces.svelte';
  import PlanTrip from './components/PlanTrip.svelte';
  import SettingsModal from './components/SettingsModal.svelte';
  import TeacherPanel from './components/TeacherPanel.svelte';
  import Toast from './components/Toast.svelte';
  import ucrLogo from './assets/firma-ucr-vertical.svg';
  import { teacherMode, themeStore, fontSizeStore, reducedMotionStore, dyslexiaFontStore } from './stores.js';
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
</script>

<div class="min-h-screen flex flex-col bg-base-200 font-sans overflow-x-hidden">
<!-- Skip to main content link for keyboard users -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
<header class="navbar bg-base-100/95 backdrop-blur-md px-4 lg:px-8 shadow-soft sticky top-0 z-50 border-b border-base-200/50">
  <div class="flex-1 flex items-center gap-4">
    <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
          <span class="text-xl">🏘️</span>
        </div>
        <div class="hidden xs:block">
          <span class="font-extrabold text-lg sm:text-xl text-base-content tracking-tight leading-tight block">Getting Around Town</span>
          <span class="text-xs text-base-content/50 font-medium hidden sm:block">Interactive Learning</span>
        </div>
    </div>
    <nav class="hidden md:flex gap-1 ml-6" aria-label="Main navigation">
        <button class="btn btn-sm rounded-lg px-5 font-semibold transition-all duration-200" 
                class:btn-primary={view !== 'learn'} 
                class:shadow-md={view !== 'learn'}
                class:btn-ghost={view === 'learn'} 
                on:click={() => setView('home')}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Activities
        </button>
        <button class="btn btn-sm rounded-lg px-5 font-semibold transition-all duration-200" 
                class:btn-primary={view === 'learn'} 
                class:shadow-md={view === 'learn'}
                class:btn-ghost={view !== 'learn'} 
                on:click={() => setView('learn')}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Learn Places
        </button>
    </nav>
  </div>
  <div class="flex-none flex items-center gap-2">
    <button class="btn btn-ghost btn-circle hover:bg-base-200 transition-colors" on:click={() => showSettings = true} aria-label="Open Settings">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
    <!-- Desktop View - Teacher Mode Toggle -->
    <div class="hidden sm:block">
      <label class="label cursor-pointer gap-2 bg-base-200/70 hover:bg-base-200 px-4 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-base-300">
        <span class="label-text font-semibold text-xs uppercase tracking-wider text-base-content/60">Teacher</span> 
        <input type="checkbox" class="toggle toggle-primary toggle-sm" bind:checked={$teacherMode} aria-label="Toggle Teacher Mode" />
      </label>
    </div>

    <!-- Mobile View (Hamburger) -->
    <div class="dropdown dropdown-end md:hidden">
      <button type="button" class="btn btn-ghost btn-circle" aria-label="Open Menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg bg-base-100 rounded-xl w-56 border border-base-200 space-y-1" role="menu">
        <li class="sm:hidden">
          <button class="rounded-lg font-medium" class:active={view !== 'learn'} on:click={() => setView('home')}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Activities
          </button>
        </li>
        <li class="sm:hidden">
          <button class="rounded-lg font-medium" class:active={view === 'learn'} on:click={() => setView('learn')}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Learn Places
          </button>
        </li>
        <li class="sm:hidden"><div class="divider my-1"></div></li>
        <li>
          <label class="label cursor-pointer justify-between active:bg-base-200 rounded-lg">
            <span class="label-text font-medium">Teacher Mode</span>
            <input type="checkbox" class="toggle toggle-primary toggle-sm" bind:checked={$teacherMode} />
          </label>
        </li>
      </ul>
    </div>
  </div>
</header>

<div id="main-content" class="flex-1 grid grid-cols-1 grid-rows-1 relative" class:pb-28={$teacherMode} tabindex="-1">
  {#if view === 'home'}
    <div class="flex-1 flex flex-col col-start-1 row-start-1 w-full" in:fade={{ duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <section class="space-y-12 lg:space-y-16">
          
          <!-- Hero Section -->
          <div class="hero relative rounded-3xl lg:rounded-4xl shadow-soft-lg border border-base-300/30 isolate overflow-hidden">
            <!-- Background with gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-base-100 via-base-100 to-primary/5 -z-10">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(101,195,200,0.08),transparent_50%)]"></div>
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(239,159,188,0.06),transparent_50%)]"></div>
            </div>
            
            <div class="hero-content flex-col lg:flex-row-reverse p-6 sm:p-10 lg:p-16 gap-8 lg:gap-16 relative z-10">
              <div class="relative">
                <div class="text-8xl lg:text-9xl animate-float select-none filter drop-shadow-xl">🗺️</div>
                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-base-content/5 rounded-full blur-sm"></div>
              </div>
              <div class="text-center lg:text-left max-w-xl">
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 lg:mb-6 leading-[1.1] tracking-tight">
                  <span class="text-gradient">Explore Your</span><br/>
                  <span class="text-base-content">Community!</span>
                </h1>
                <p class="text-base sm:text-lg lg:text-xl text-base-content/70 max-w-lg leading-relaxed mb-6 lg:mb-8">
                  Learn how to navigate your city, help visitors find their way, and stay safe while walking. Choose a fun activity below to get started!
                </p>
                <button class="btn btn-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-none bg-gradient-to-r from-primary to-primary/90 text-primary-content gap-2 font-bold" on:click={() => setView('learn')}>
                    Start Learning
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Section Header -->
          <div class="flex items-center gap-4">
            <div class="h-10 w-1.5 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <div>
              <h2 class="text-2xl sm:text-3xl font-bold text-base-content">Interactive Activities</h2>
              <p class="text-sm text-base-content/60 mt-1">Choose an activity to practice your skills</p>
            </div>
          </div>

          <!-- Activity Cards Grid -->
          <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
            <!-- Help Visitor Card -->
            <article class="card bg-base-100 shadow-soft hover-lift group overflow-hidden border border-base-200/50">
              <div class="h-1.5 bg-gradient-to-r from-primary to-primary/70"></div>
              <div class="card-body relative p-6 lg:p-7">
                <div class="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 text-[8rem] pointer-events-none select-none">💬</div>
                <div class="flex flex-col h-full relative z-10">
                  <div class="mb-5">
                    <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl mb-5 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 shadow-sm border border-primary/10">
                        💬
                    </div>
                    <h3 class="card-title text-xl font-bold mb-2 text-base-content">Help the Visitor</h3>
                    <p class="text-sm text-base-content/60 leading-relaxed">Read scenarios and guide visitors to the right place in town.</p>
                  </div>
                  
                  <div class="mt-auto pt-4">
                    <div class="flex flex-wrap gap-1.5 mb-5">
                        <span class="badge badge-sm bg-base-200 text-base-content/70 border-none font-medium">10 Scenarios</span>
                        <span class="badge badge-sm bg-base-200 text-base-content/70 border-none font-medium">Scoring</span>
                    </div>
                    <button class="btn btn-primary w-full rounded-xl shadow-sm group-hover:shadow-md transition-all font-semibold" on:click={() => setView('help-visitor')}>
                      Play Now
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <!-- Safe Walk Card -->
            <article class="card bg-base-100 shadow-soft hover-lift group overflow-hidden border border-base-200/50">
              <div class="h-1.5 bg-gradient-to-r from-secondary to-secondary/70"></div>
              <div class="card-body relative p-6 lg:p-7">
                <div class="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 text-[8rem] pointer-events-none select-none">🚦</div>
                <div class="flex flex-col h-full relative z-10">
                  <div class="mb-5">
                    <div class="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-4xl mb-5 group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-300 shadow-sm border border-secondary/10">
                        🚦
                    </div>
                    <h3 class="card-title text-xl font-bold mb-2 text-base-content">Safe Walk</h3>
                    <p class="text-sm text-base-content/60 leading-relaxed">Order the steps to show a safe walking sequence.</p>
                  </div>
                  
                  <div class="mt-auto pt-4">
                    <div class="flex flex-wrap gap-1.5 mb-5">
                        <span class="badge badge-sm bg-base-200 text-base-content/70 border-none font-medium">Drag & Drop</span>
                        <span class="badge badge-sm bg-base-200 text-base-content/70 border-none font-medium">Safety</span>
                    </div>
                    <button class="btn btn-secondary w-full rounded-xl shadow-sm group-hover:shadow-md transition-all font-semibold" on:click={() => setView('safe-walk')}>
                      Play Now
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <!-- Short Q&A Card -->
            <article class="card bg-base-100 shadow-soft hover-lift group overflow-hidden border border-base-200/50">
              <div class="h-1.5 bg-gradient-to-r from-accent to-accent/70"></div>
              <div class="card-body relative p-6 lg:p-7">
                <div class="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 text-[8rem] pointer-events-none select-none">❓</div>
                <div class="flex flex-col h-full relative z-10">
                  <div class="mb-5">
                    <div class="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-4xl mb-5 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 shadow-sm border border-accent/10">
                        ❓
                    </div>
                    <h3 class="card-title text-xl font-bold mb-2 text-base-content">Short Q&A</h3>
                    <p class="text-sm text-base-content/60 leading-relaxed">Choose the best response for everyday questions.</p>
                  </div>
                  
                  <div class="mt-auto pt-4">
                    <div class="flex flex-wrap gap-1.5 mb-5">
                        <span class="badge badge-sm bg-base-200 text-base-content/70 border-none font-medium">5 Questions</span>
                        <span class="badge badge-sm bg-base-200 text-base-content/70 border-none font-medium">Logic</span>
                    </div>
                    <button class="btn btn-accent w-full rounded-xl shadow-sm group-hover:shadow-md transition-all font-semibold text-accent-content" on:click={() => setView('short-qa')}>
                      Play Now
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <!-- Plan Trip Card -->
            <article class="card bg-base-100 shadow-soft hover-lift group overflow-hidden border border-base-200/50">
              <div class="h-1.5 bg-gradient-to-r from-info to-info/70"></div>
              <div class="card-body relative p-6 lg:p-7">
                <div class="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 text-[8rem] pointer-events-none select-none">🎒</div>
                <div class="flex flex-col h-full relative z-10">
                  <div class="mb-5">
                    <div class="w-16 h-16 rounded-2xl bg-info/10 flex items-center justify-center text-4xl mb-5 group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-300 shadow-sm border border-info/10">
                        🎒
                    </div>
                    <h3 class="card-title text-xl font-bold mb-2 text-base-content">Plan Your Trip</h3>
                    <p class="text-sm text-base-content/60 leading-relaxed">Pack your bag and choose how to travel.</p>
                  </div>
                  
                  <div class="mt-auto pt-4">
                    <div class="flex flex-wrap gap-1.5 mb-5">
                        <span class="badge badge-sm bg-base-200 text-base-content/70 border-none font-medium">Step-by-Step</span>
                        <span class="badge badge-sm bg-base-200 text-base-content/70 border-none font-medium">Planning</span>
                    </div>
                    <button class="btn btn-info w-full rounded-xl shadow-sm group-hover:shadow-md transition-all font-semibold text-info-content" on:click={() => setView('plan-trip')}>
                      Start Planning
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

        </section>
      </main>

      <footer class="mt-16 bg-neutral text-neutral-content">
          <div class="max-w-7xl mx-auto p-8 lg:p-12">
            <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div class="flex flex-col sm:flex-row items-center gap-6">
                  <img src={ucrLogo} alt="University of Costa Rica" class="h-16 lg:h-20 w-auto brightness-0 invert opacity-80" />
                  <div class="h-px w-16 sm:h-12 sm:w-px bg-white/20"></div>
                  <div class="text-center sm:text-left">
                      <p class="font-bold text-lg">TCU-501 Project</p>
                      <p class="text-sm opacity-60">Escuela de Lenguas Modernas</p>
                      <p class="text-sm opacity-60">Universidad de Costa Rica</p>
                  </div>
              </div>
              <div class="flex flex-col sm:flex-row gap-3 items-center">
                  <a
                  href="https://lenguasmodernas.ucr.ac.cr/tcu-501/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline btn-sm text-neutral-content border-neutral-content/30 hover:bg-white hover:text-neutral hover:border-white gap-2 rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Visit TCU-501 Website
                </a>
              </div>
            </div>
            <div class="mt-8 pt-6 border-t border-white/10 text-center text-xs opacity-40">
              <p>&copy; {new Date().getFullYear()} Getting Around Town. Universidad de Costa Rica. All rights reserved.</p>
            </div>
          </div>
      </footer>
    </div>
  {:else if view === 'help-visitor'}
    <main class="flex-1 p-4 max-w-6xl mx-auto w-full col-start-1 row-start-1" in:fly={{ y: 20, duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
        <HelpVisitor on:back={() => setView('home')} />
    </main>
  {:else if view === 'safe-walk'}
    <main class="flex-1 p-4 max-w-6xl mx-auto w-full col-start-1 row-start-1" in:fly={{ y: 20, duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
        <SafeWalkSequence on:back={() => setView('home')} />
    </main>
  {:else if view === 'short-qa'}
    <main class="flex-1 p-4 max-w-6xl mx-auto w-full col-start-1 row-start-1" in:fly={{ y: 20, duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
        <ShortQA on:back={() => setView('home')} />
    </main>
  {:else if view === 'plan-trip'}
    <main class="flex-1 p-4 max-w-6xl mx-auto w-full col-start-1 row-start-1" in:fly={{ y: 20, duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
        <PlanTrip on:back={() => setView('home')} />
    </main>
  {:else if view === 'learn'}
    <main class="flex-1 p-4 max-w-6xl mx-auto w-full col-start-1 row-start-1" in:fly={{ y: 20, duration: 300, delay: 200 }} out:fade={{ duration: 200 }}>
        <LearnPlaces />
    </main>
  {/if}
</div>

</div>

{#if $teacherMode}
  <TeacherPanel />
{/if}

{#if showSettings}
  <SettingsModal on:close={() => showSettings = false} />
{/if}

<Toast />
