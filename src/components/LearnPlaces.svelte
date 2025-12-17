<script>
  import { PLACES } from '../data/places.js';

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

  $: filteredPlaces = PLACES.filter(place => 
    place.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (descriptions[place.id] && descriptions[place.id].toLowerCase().includes(searchTerm.toLowerCase()))
  );
</script>

<div class="space-y-6">
  <div class="text-center space-y-4">
    <h1 class="text-4xl font-bold text-primary">Explore Our Community</h1>
    <p class="text-lg opacity-80 max-w-2xl mx-auto">
      There are so many important places in our town! Click on a card to learn more about what happens there.
    </p>
    
    <div class="form-control max-w-md mx-auto relative">
      <input 
        type="text" 
        placeholder="Search for a place..." 
        class="input input-bordered w-full text-base pl-10 focus:input-primary transition-colors shadow-sm" 
        bind:value={searchTerm}
      />
      <div class="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none text-lg">
        🔍
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each filteredPlaces as place}
      <button 
        type="button"
        class="card bg-base-100 shadow hover:shadow-lg transition-all duration-200 active:scale-95 sm:hover:-translate-y-1 border border-base-200 touch-manipulation cursor-pointer w-full text-left"
        on:click={() => {/* Placeholder for future detail view */}}
      >
        <div class="card-body items-center text-center p-6">
          <div class="text-6xl mb-2">{place.emoji}</div>
          <h2 class="card-title text-xl">{place.label}</h2>
          <p class="text-sm text-gray-600 mt-2">
            {descriptions[place.id] || "A place in our community."}
          </p>
        </div>
      </button>
    {/each}
  </div>
  
  {#if filteredPlaces.length === 0}
    <div class="text-center py-10 opacity-50">
      <p>No places found matching "{searchTerm}"</p>
    </div>
  {/if}
</div>
