<script>
  import { PLACES } from '../data/places.js';
  import { fade, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  const descriptions = {
    bakery: "A yummy smelling shop where you can buy fresh bread, cakes, and cookies.",
    bus_stop: "Wait here to catch a bus to go to other parts of town.",
    hospital: "Doctors and nurses help sick people get better here.",
    library: "A quiet place where you can read and borrow books for free.",
    park: "A fun outdoor place with grass and trees to play and relax.",
    supermarket: "A big store where you can buy food and things for your house.",
    traffic_light: "Lights that tell cars and people when to stop (red) and go (green).",
    crosswalk: "White lines on the road that show where it is safe to cross the street.",
    sidewalk: "A safe path on the side of the road just for walking.",
    school: "A place where children go to learn, make friends, and play.",
    pharmacy: "A store where you can buy medicine to help you feel better.",
    restaurant: "A place to sit down and eat a delicious meal cooked for you.",
    cafe: "A cozy place to get a hot drink like cocoa or a small snack.",
    bank: "A safe place to keep your money and save it for later.",
    post_office: "Bring your letters and packages here to send them to friends.",
    gas_station: "Cars stop here to get fuel so they can keep driving.",
    gym: "A place with equipment to exercise and make your muscles strong.",
    movie_theater: "Watch new movies on a huge screen with popcorn!",
    museum: "See cool old things, art, or dinosaur bones here.",
    police_station: "Police officers work here to keep our town safe.",
    fire_station: "Firefighters and big red trucks wait here to help put out fires.",
    church: "A building where people go to pray and worship.",
    mall: "A huge building with many different stores inside.",
    dentist: "Go here to have your teeth cleaned and checked.",
    pet_store: "A shop where you can buy food and toys for your pets.",
    bookstore: "A shop where you can buy new books to keep.",
    train_station: "Wait here to catch a train for a long trip.",
    airport: "Planes take off and land here to take people far away.",
    hotel: "A place to sleep when you are traveling away from home.",
    playground: "A fun place with swings and slides for kids.",
    atm: "A machine where you can get cash money from your bank account.",
    parking_lot: "A place to leave your car while you visit other places.",
    laundromat: "A place to wash and dry your clothes if you don't have machines at home.",
    barbershop: "A place to get a haircut.",
    flower_shop: "Buy beautiful flowers and plants here.",
    bike_lane: "A special part of the road just for riding bicycles.",
    swimming_pool: "A big pool of water for swimming and splashing.",
    city_hall: "Where the mayor and other leaders work for the town.",
    construction_site: "A place where workers are building something new. Wear a hard hat!",
    taxi_stand: "Wait here to get a taxi ride."
  };

  let searchTerm = '';
  let selectedPlace = null;

  $: filteredPlaces = PLACES.filter(place => 
    place.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (descriptions[place.id] && descriptions[place.id].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function openPlace(place) {
    selectedPlace = place;
  }

  function closePlace() {
    selectedPlace = null;
  }
</script>

<div class="space-y-8 pb-12">
  <div class="text-center space-y-6" in:fade={{ duration: 400 }}>
    <h1 class="text-5xl font-black text-primary tracking-tight">Explore Our Community</h1>
    <p class="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
      There are so many important places in our town! Click on a card to learn more about what happens there.
    </p>
    
    <div class="form-control max-w-lg mx-auto relative group">
      <input 
        type="text" 
        placeholder="Search for a place..." 
        class="input input-lg input-bordered w-full pl-12 rounded-full shadow-sm focus:shadow-lg focus:input-primary transition-all bg-base-100" 
        bind:value={searchTerm}
      />
      <div class="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 group-focus-within:text-primary transition-all text-xl">
        🔍
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {#each filteredPlaces as place (place.id)}
      <button 
        type="button"
        class="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-base-200 touch-manipulation cursor-pointer w-full text-left group overflow-hidden"
        on:click={() => openPlace(place)}
        animate:flip={{ duration: 300 }}
      >
        <div class="card-body items-center text-center p-6 relative">
          <div class="absolute inset-0 bg-gradient-to-b from-base-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="text-7xl mb-4 transform transition-transform group-hover:scale-110 duration-300 filter drop-shadow-sm">{place.emoji}</div>
          <h2 class="card-title text-xl font-bold mb-2">{place.label}</h2>
          <p class="text-sm opacity-70 line-clamp-2 leading-relaxed">
            {descriptions[place.id] || "A place in our community."}
          </p>
          <div class="mt-4 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
            Read More ➜
          </div>
        </div>
      </button>
    {/each}
  </div>
  
  {#if filteredPlaces.length === 0}
    <div class="text-center py-16 opacity-50 flex flex-col items-center gap-4">
      <div class="text-6xl grayscale">🏙️</div>
      <p class="text-xl">No places found matching "{searchTerm}"</p>
      <button class="btn btn-ghost btn-sm" on:click={() => searchTerm = ''}>Clear Search</button>
    </div>
  {/if}
</div>

{#if selectedPlace}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-content/20 backdrop-blur-sm" 
    on:click={closePlace} 
    on:keydown={(e) => { if (e.key === 'Escape') closePlace(); }}
    role="button"
    tabindex="0"
    transition:fade={{ duration: 200 }}
  >
    <div 
      class="card w-full max-w-lg bg-base-100 shadow-2xl overflow-hidden cursor-default" 
      on:click|stopPropagation 
      on:keydown|stopPropagation
      role="document"
      tabindex="-1"
      transition:scale={{ duration: 200, start: 0.9 }}
    >
      <div class="relative h-32 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
        <button class="btn btn-circle btn-sm btn-ghost absolute top-2 right-2 bg-base-100/50 hover:bg-base-100" on:click={closePlace}>✕</button>
        <div class="text-8xl shadow-xl rounded-3xl bg-base-100 p-2 transform translate-y-8">{selectedPlace.emoji}</div>
      </div>
      <div class="card-body items-center text-center pt-12 pb-8 px-8">
        <h2 class="text-3xl font-black mb-4">{selectedPlace.label}</h2>
        <p class="text-lg leading-relaxed opacity-80">
            {descriptions[selectedPlace.id] || "A place in our community."}
        </p>
        <div class="card-actions mt-8 w-full">
            <button class="btn btn-primary btn-block rounded-xl" on:click={closePlace}>Close</button>
        </div>
      </div>
    </div>
  </div>
{/if}
