<script>
  import { PLACES } from '../data/places.js';
  import { fade, scale, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { onMount } from 'svelte';

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
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="space-y-8 pb-12">
  <div class="text-center space-y-6" in:fade={{ duration: 400 }}>
    <h1 class="text-5xl font-black text-primary tracking-tight">Explore Our Community</h1>
    <p class="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
      There are so many important places in our town! Click on a card to learn more about what happens there.
    </p>
    
    <!-- Search and Filter Section -->
    <div class="flex flex-col items-center gap-6 max-w-4xl mx-auto">
      <div class="form-control w-full max-w-lg relative group">
        <label for="search-places" class="sr-only">Search for a place</label>
        <input 
          id="search-places"
          type="text" 
          placeholder="Search for a place..." 
          class="input input-lg input-bordered w-full pl-12 rounded-full shadow-sm focus:shadow-lg focus:input-primary transition-all bg-base-100" 
          bind:value={searchTerm}
        />
        <div class="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 group-focus-within:text-primary transition-all text-xl pointer-events-none">
          🔍
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="flex flex-wrap justify-center gap-2">
        {#each categories as category}
          <button 
            class="btn btn-sm rounded-full transition-all {selectedCategory === category ? 'btn-primary shadow-md' : 'btn-ghost hover:bg-base-200'}"
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
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {#each filteredPlaces as place (place.id)}
      <button 
        type="button"
        class="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-base-200 touch-manipulation cursor-pointer w-full text-left group overflow-hidden h-full"
        on:click={() => openPlace(place)}
        animate:flip={{ duration: 300 }}
        aria-label={`View details for ${place.label}`}
      >
        <div class="card-body items-center text-center p-6 relative h-full">
          <div class="absolute inset-0 bg-gradient-to-b from-base-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <!-- Category Badge -->
          <div class="absolute top-2 right-2 badge badge-ghost badge-sm opacity-50 group-hover:opacity-100 transition-opacity">
            {place.category}
          </div>

          <div class="text-7xl mb-4 transform transition-transform group-hover:scale-110 duration-300 filter drop-shadow-sm">{place.emoji}</div>
          <h2 class="card-title text-xl font-bold mb-2">{place.label}</h2>
          <p class="text-sm opacity-70 line-clamp-2 leading-relaxed">
            {place.description}
          </p>
          
          <div class="mt-auto pt-4 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 flex items-center gap-1">
            Read More <span>➜</span>
          </div>
        </div>
      </button>
    {/each}
  </div>
  
  {#if filteredPlaces.length === 0}
    <div class="text-center py-16 opacity-50 flex flex-col items-center gap-4" in:fade>
      <div class="text-6xl grayscale">🏙️</div>
      <p class="text-xl">No places found matching "{searchTerm}"</p>
      <button class="btn btn-ghost btn-sm" on:click={() => { searchTerm = ''; selectedCategory = 'All'; }}>Clear Filters</button>
    </div>
  {/if}
</div>

<!-- Modal -->
{#if selectedPlace}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-content/60 backdrop-blur-sm" 
    on:click={closePlace} 
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    transition:fade={{ duration: 200 }}
  >
    <div 
      class="card w-full max-w-lg bg-base-100 shadow-2xl overflow-hidden cursor-default relative" 
      on:click|stopPropagation 
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <div class="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
        <!-- Decorative circles -->
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>

        <button 
          class="btn btn-circle btn-sm btn-ghost absolute top-2 right-2 bg-base-100/50 hover:bg-base-100 z-10" 
          on:click={closePlace}
          aria-label="Close modal"
        >✕</button>
        
        <div class="text-9xl shadow-2xl rounded-3xl bg-base-100 p-4 transform translate-y-10 rotate-3 transition-transform hover:rotate-0 duration-500">
          {selectedPlace.emoji}
        </div>
      </div>
      
      <div class="card-body items-center text-center pt-16 pb-8 px-8">
        <div class="badge badge-primary badge-outline mb-2">{selectedPlace.category}</div>
        <h2 id="modal-title" class="text-4xl font-black mb-6 text-base-content">{selectedPlace.label}</h2>
        
        <div class="bg-base-200/50 p-6 rounded-2xl w-full">
          <p class="text-lg leading-relaxed opacity-90 font-medium">
              {selectedPlace.description}
          </p>
        </div>

        <div class="card-actions mt-8 w-full">
            <button class="btn btn-primary btn-lg btn-block rounded-xl shadow-lg hover:shadow-primary/50 transition-all" on:click={closePlace}>
              Got it!
            </button>
        </div>
      </div>
    </div>
  </div>
{/if}
