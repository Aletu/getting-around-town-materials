<script>
  import HelpVisitor from './components/HelpVisitor.svelte';
  import SafeWalkSequence from './components/SafeWalkSequence.svelte';
  import ShortQA from './components/ShortQA.svelte';
  import ucrLogo from './assets/firma-ucr-vertical.svg';
  import { teacherMode } from './stores.js';

  let view = 'home';
  function setView(id) {
    view = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<div class="min-h-screen flex flex-col">
<header class="navbar bg-base-100 px-4 shadow-sm">
  <div class="flex-1">
    <span class="font-bold text-2xl sm:text-xl text-primary">Getting Around Town!</span>
  </div>
  <div class="flex-none">
    <label class="label cursor-pointer gap-2">
      <span class="label-text font-medium">Teacher Mode</span> 
      <input type="checkbox" class="toggle toggle-primary" bind:checked={$teacherMode} />
    </label>
  </div>
</header>

<main class="flex-1 p-4 max-w-5xl mx-auto w-full">
  {#if view === 'home'}
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Materials Overview</h1>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <article class="card bg-base-100 shadow hover:shadow-lg transition-shadow duration-150 group">
          <div class="card-body">
            <div class="flex items-start gap-3">
              <div class="text-3xl">💬</div>
              <div>
                <h2 class="card-title">Help the Visitor</h2>
                <p class="text-sm opacity-80">Read different scenarios and choose the correct community place to help visitors find what they need.</p>
                <ul class="mt-3 text-xs space-y-1">
                  <li>• 10 different scenarios</li>
                  <li>• Immediate feedback and scoring</li>
                </ul>
              </div>
            </div>
            <div class="mt-4 sm:mt-6">
              <button class="btn btn-primary w-full sm:w-auto" on:click={() => setView('help-visitor')}>Open module →</button>
            </div>
          </div>
        </article>

        <article class="card bg-base-100 shadow hover:shadow-lg transition-shadow duration-150 group">
          <div class="card-body">
            <div class="flex items-start gap-3">
              <div class="text-3xl"></div>
              <div>
                <h2 class="card-title">Safe Walk Sequence</h2>
                <p class="text-sm opacity-80">Read a short safety text and arrange images in order to demonstrate a safe walking sequence.</p>
                <ul class="mt-3 text-xs space-y-1">
                  <li>• Drag & drop to reorder</li>
                  <li>• Check sequence and get feedback</li>
                </ul>
              </div>
            </div>
            <div class="mt-4 sm:mt-6">
              <button class="btn btn-primary w-full sm:w-auto" on:click={() => setView('safe-walk')}>Open module →</button>
            </div>
          </div>
        </article>

        <article class="card bg-base-100 shadow hover:shadow-lg transition-shadow duration-150 group">
          <div class="card-body">
            <div class="flex items-start gap-3">
              <div class="text-3xl">❓</div>
              <div>
                <h2 class="card-title">Short Q&A – Step-by-step directions</h2>
                <p class="text-sm opacity-80">Read short questions and choose the response that makes the most sense in context.</p>
                <ul class="mt-3 text-xs space-y-1">
                  <li>• 5 questions per session</li>
                  <li>• Focus on meaningful answers, not only grammar</li>
                </ul>
              </div>
            </div>
            <div class="mt-4 sm:mt-6">
              <button class="btn btn-primary w-full sm:w-auto" on:click={() => setView('short-qa')}>Open module →</button>
            </div>
          </div>
        </article>
      </div>

    </section>
  {:else if view === 'help-visitor'}
    <HelpVisitor on:back={() => setView('home')} />
  {:else if view === 'safe-walk'}
    <SafeWalkSequence on:back={() => setView('home')} />
  {:else if view === 'short-qa'}
    <ShortQA on:back={() => setView('home')} />
  {/if}
</main>

<footer class="mt-8">
  <div class="bg-[#3270d6] text-white">
    <div class="max-w-5xl mx-auto p-6">
      <div class="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-10 md:gap-14">
        <img src={ucrLogo} alt="University of Costa Rica – vertical signature" class="h-20 sm:h-24 w-auto select-none" />
        <div class="text-sm sm:pl-6 sm:border-l sm:border-white/25 flex flex-col justify-center">
          <p class="opacity-90">TCU-501 Project · Escuela de Lenguas Modernas</p>
          <a
            href="https://lenguasmodernas.ucr.ac.cr/tcu-501/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 mt-1 underline font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
          >
            Visit the TCU-501 website →
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>

</div>

<style>
  /* subtle card hover: shadow only (no levitation) */
  .card:hover {
    box-shadow: 0 12px 30px rgba(0,0,0,0.1);
  }
  .card:focus-within {
    outline: 2px solid rgba(59,130,246,0.5);
  }
</style>