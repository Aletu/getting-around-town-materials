<script>
  import HelpVisitor from './components/HelpVisitor.svelte';
  import SafeWalkSequence from './components/SafeWalkSequence.svelte';

  let view = 'home';
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'help-visitor', label: 'Help the Visitor' },
    { id: 'safe-walk', label: 'Safe Walk Sequence' }
  ];
  function setView(id) {
    view = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<header class="navbar bg-base-200 px-4">
  <div class="flex-1">
    <span class="font-bold text-lg">Getting Around Town!</span>
  </div>
  <nav class="flex gap-2">
    {#each navItems as item}
      <button
        class="btn btn-ghost btn-sm"
        class:selected={view === item.id}
        on:click={() => setView(item.id)}
        aria-current={view === item.id ? 'page' : 'false'}>
        {item.label}
      </button>
    {/each}
  </nav>
</header>

<main class="p-4 max-w-5xl mx-auto">
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
              <div class="text-3xl">🚦</div>
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
              <button class="btn btn-secondary w-full sm:w-auto" on:click={() => setView('safe-walk')}>Open module →</button>
            </div>
          </div>
        </article>
      </div>

    </section>
  {:else if view === 'help-visitor'}
    <HelpVisitor on:back={() => setView('home')} />
  {:else if view === 'safe-walk'}
    <SafeWalkSequence on:back={() => setView('home')} />
  {/if}
</main>

<footer class="p-4 text-center text-xs opacity-70">
  © {new Date().getFullYear()} Getting Around Town – Educational Prototype
</footer>

<style>
  button.selected {
    font-weight: 600;
    text-decoration: underline;
  }

  /* subtle card hover: shadow only (no levitation) */
  .card:hover {
    box-shadow: 0 12px 30px rgba(0,0,0,0.06);
  }
  .card:focus-within {
    outline: 2px solid rgba(59,130,246,0.2);
  }
</style>