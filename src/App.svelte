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
    <section class="space-y-4">
      <h1 class="text-2xl font-bold">Materials Overview</h1>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Material #1: Help the Visitor</h2>
            <p class="text-sm">
              Short text hints with greetings/warnings (R.1 / R.1.1). Select the correct community place.
            </p>
            <button class="btn btn-primary btn-sm mt-2" on:click={() => setView('help-visitor')}>
              Open
            </button>
          </div>
        </div>
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Material #2: Safe Walk Sequence</h2>
            <p class="text-sm">
              Read a short text and order the images (R.2 / R.2.1).
            </p>
            <button class="btn btn-secondary btn-sm mt-2" on:click={() => setView('safe-walk')}>
              Open
            </button>
          </div>
        </div>
      </div>
      <p class="text-xs opacity-70">Both materials share the same domain/site. Add future modules reusing this structure.</p>
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
</style>