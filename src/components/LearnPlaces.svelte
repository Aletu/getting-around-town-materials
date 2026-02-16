<script>
  import { PLACES } from '../data/places.js';
  import { fade, scale, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { onMount, onDestroy } from 'svelte';

  let searchTerm = '';
  let selectedPlace = null;
  let selectedCategory = 'All';

  // Extract unique categories
  const categories = ['All', ...new Set(PLACES.map(p => p.category))].sort();

  $: filteredPlaces = PLACES.filter(place => {
    const matchesSearch = place.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          place.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function openPlace(place) {
    selectedPlace = place;
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  }

  function closePlace() {
    selectedPlace = null;
    // Unlock body scroll
    document.body.style.overflow = '';
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && selectedPlace) {
      closePlace();
    }
  }

  onDestroy(() => {
    // Ensure body scroll is restored if component unmounts while modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="space-y-8 pb-12">
  <div class="text-center space-y-4" in:fade={{ duration: 400 }}>
    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-base-content tracking-tight">
      <span class="text-gradient">Explore</span> Our Community
    </h1>
    <p class="text-base sm:text-lg text-base-content/60 max-w-2xl mx-auto leading-relaxed">
      There are so many important places in our town! Click on a card to learn more about what happens there.
    </p>
    
    <!-- Search and Filter Section -->
    <div class="flex flex-col items-center gap-5 max-w-3xl mx-auto pt-4">
      <div class="form-control w-full max-w-md relative group">
        <label for="search-places" class="sr-only">Search for a place</label>
        <input 
          id="search-places"
          type="text" 
          placeholder="Search for a place..." 
          class="input input-bordered w-full pl-11 pr-4 rounded-xl shadow-sm focus:shadow-md focus:input-primary transition-all bg-base-100 border-base-200" 
          bind:value={searchTerm}
        />
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="flex flex-wrap justify-center gap-1.5">
        {#each categories as category}
          <button 
            class="btn btn-sm rounded-lg transition-all font-medium {selectedCategory === category ? 'btn-primary shadow-sm' : 'btn-ghost hover:bg-base-200 text-base-content/70'}"
            on:click={() => selectedCategory = category}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Results Grid -->
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {#each filteredPlaces as place (place.id)}
      <button 
        type="button"
        class="card bg-base-100 shadow-sm hover:shadow-soft transition-all duration-300 hover:-translate-y-1 border border-base-200/50 touch-manipulation cursor-pointer w-full text-left group overflow-hidden h-full"
        on:click={() => openPlace(place)}
        animate:flip={{ duration: 300 }}
        aria-label={`View details for ${place.label}`}
      >
        <div class="card-body items-center text-center p-4 sm:p-5 relative h-full">
          <!-- Category Badge -->
          <div class="absolute top-2 right-2 badge badge-ghost badge-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {place.category}
          </div>

          <div class="text-5xl sm:text-6xl mb-3 transform transition-transform group-hover:scale-110 duration-300 filter drop-shadow-sm">{place.emoji}</div>
          <h2 class="font-bold text-sm sm:text-base mb-1 text-base-content">{place.label}</h2>
          <p class="text-xs text-base-content/50 line-clamp-2 leading-relaxed hidden sm:block">
            {place.description}
          </p>
          
          <div class="mt-auto pt-2 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Learn more <span>→</span>
          </div>
        </div>
      </button>
    {/each}
  </div>
  
  {#if filteredPlaces.length === 0}
    <div class="text-center py-16 flex flex-col items-center gap-4" in:fade>
      <div class="text-6xl grayscale opacity-30">🏙️</div>
      <p class="text-lg text-base-content/50">No places found matching "{searchTerm}"</p>
      <button class="btn btn-ghost btn-sm gap-2" on:click={() => { searchTerm = ''; selectedCategory = 'All'; }}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        Clear Filters
      </button>
    </div>
  {/if}
</div>

<!-- Modal -->
{#if selectedPlace}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-content/50 backdrop-blur-sm" 
    on:click={closePlace}
    on:keydown={(e) => e.key === 'Escape' && closePlace()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    transition:fade={{ duration: 200 }}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div 
      class="card w-full max-w-md bg-base-100 shadow-2xl overflow-hidden cursor-default relative rounded-2xl border border-base-200/50" 
      on:click|stopPropagation 
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <!-- Header with gradient background -->
      <div class="relative h-32 sm:h-36 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/5 flex items-center justify-center">
        <!-- Decorative elements -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute -top-16 -left-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-16 -right-16 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <button 
          class="btn btn-circle btn-sm btn-ghost absolute top-3 right-3 bg-base-100/80 hover:bg-base-100 z-20 shadow-sm" 
          on:click={closePlace}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <!-- Emoji icon -->
        <div class="text-7xl sm:text-8xl transform translate-y-6 relative z-10 drop-shadow-lg">
          {selectedPlace.emoji}
        </div>
      </div>
      
      <!-- Content -->
      <div class="card-body items-center text-center pt-10 pb-6 px-6">
        <div class="badge badge-primary badge-sm font-medium mb-2">{selectedPlace.category}</div>
        <h2 id="modal-title" class="text-2xl sm:text-3xl font-bold mb-4 text-base-content">{selectedPlace.label}</h2>
        
        <div class="bg-base-200/50 p-4 sm:p-5 rounded-xl w-full border border-base-200/50">
          <p class="text-sm sm:text-base leading-relaxed text-base-content/80">
              {selectedPlace.description}
          </p>
        </div>

        <div class="card-actions mt-6 w-full">
            <button class="btn btn-primary btn-block rounded-xl font-semibold shadow-sm hover:shadow-md transition-all" on:click={closePlace}>
              Got it!
            </button>
        </div>
      </div>
    </div>
  </div>
{/if}
