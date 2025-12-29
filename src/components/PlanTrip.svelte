<script>
  import { PLACES } from '../data/places.js';
  import { PACKING_ITEMS, TRANSPORT_OPTIONS } from '../data/tripData.js';
  import { fade, fly, slide, scale } from 'svelte/transition';
  import { toastStore } from '../stores.js';

  let step = 1;
  let selectedPlace = null;
  let selectedItems = [];
  let selectedTransport = null;

  // Filter places to only show physical locations (exclude some abstract ones if needed, but PLACES seems fine)
  const destinations = PLACES.filter(p => p.category !== 'Transport'); // Exclude 'Bus Stop' as a destination if it's in there

  function toggleItem(item) {
    if (selectedItems.includes(item)) {
      selectedItems = selectedItems.filter(i => i !== item);
    } else {
      selectedItems = [...selectedItems, item];
    }
  }

  function nextStep() {
    if (step === 1 && !selectedPlace) {
        toastStore.add('Please select a destination first!', 'warning');
        return;
    }
    if (step === 2) {
        const missingRequired = PACKING_ITEMS.filter(i => i.required && !selectedItems.includes(i));
        if (missingRequired.length > 0) {
            toastStore.add(`Don't forget your ${missingRequired[0].label}!`, 'warning');
            return;
        }
    }
    if (step === 3 && !selectedTransport) {
        toastStore.add('Please choose how you will get there!', 'warning');
        return;
    }
    
    step += 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function prevStep() {
    if (step > 1) step -= 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetTrip() {
    step = 1;
    selectedPlace = null;
    selectedItems = [];
    selectedTransport = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<style>
  @media print {
    :global(body > *) {
      visibility: hidden;
    }
    
    /* Make the printable area visible */
    #printable-plan, #printable-plan * {
      visibility: visible;
    }

    /* Position the card at the top-left of the page */
    #printable-plan {
      position: fixed;
      left: 50%;
      top: 20px;
      transform: translateX(-50%);
      width: 100%;
      max-width: 600px;
      margin: 0;
      padding: 0;
      border: 2px solid #ccc;
      box-shadow: none;
      background-color: white;
      z-index: 9999;
    }

    /* Ensure background colors print */
    :global(body) {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>

<div class="max-w-4xl mx-auto p-4 space-y-8">
  
  <!-- Header -->
  <div class="text-center space-y-2">
    <h1 class="text-4xl font-black text-primary">Trip Planner</h1>
    <p class="text-xl opacity-70">Let's get ready for an outing!</p>
  </div>

  <!-- Steps Indicator -->
  <div class="w-full overflow-x-auto pb-4">
      <ul class="steps steps-horizontal w-full min-w-[500px]">
        <li class="step" class:step-primary={step >= 1}>Pick Destination</li>
        <li class="step" class:step-primary={step >= 2}>Pack Bag</li>
        <li class="step" class:step-primary={step >= 3}>Choose Travel</li>
        <li class="step" class:step-primary={step >= 4}>Ready!</li>
      </ul>
  </div>

  <!-- Content Area -->
  <div class="bg-base-100 rounded-3xl shadow-xl p-6 sm:p-10 min-h-[400px]">
    
    <!-- Step 1: Destination -->
    {#if step === 1}
      <div in:fade class="space-y-6">
        <h2 class="text-2xl font-bold text-center">Where do you want to go today?</h2>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {#each destinations as place}
            <button 
              class="card bg-base-200 hover:bg-base-300 transition-all duration-200 cursor-pointer border-2"
              class:border-primary={selectedPlace === place}
              class:border-transparent={selectedPlace !== place}
              class:scale-105={selectedPlace === place}
              on:click={() => selectedPlace = place}
            >
              <div class="card-body items-center text-center p-4">
                <span class="text-4xl mb-2">{place.emoji}</span>
                <h3 class="font-bold text-sm sm:text-base">{place.label}</h3>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Step 2: Packing -->
    {#if step === 2}
      <div in:fade class="space-y-6">
        <div class="text-center space-y-2">
            <h2 class="text-2xl font-bold">What do you need to bring?</h2>
            <p class="opacity-70">Select the items to put in your bag.</p>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {#each PACKING_ITEMS as item}
            <button 
              class="card bg-base-200 hover:bg-base-300 transition-all duration-200 cursor-pointer border-2 relative overflow-hidden"
              class:border-primary={selectedItems.includes(item)}
              class:border-transparent={!selectedItems.includes(item)}
              on:click={() => toggleItem(item)}
            >
              {#if selectedItems.includes(item)}
                <div class="absolute top-2 right-2 text-primary" in:scale>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
              {/if}
              <div class="card-body items-center text-center p-4">
                <span class="text-4xl mb-2">{item.emoji}</span>
                <h3 class="font-bold text-sm sm:text-base">{item.label}</h3>
                {#if item.required}
                    <span class="badge badge-warning mt-2 py-3 font-bold shadow-sm">Important</span>
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Step 3: Transport -->
    {#if step === 3}
      <div in:fade class="space-y-6">
        <h2 class="text-2xl font-bold text-center">How will you get there?</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {#each TRANSPORT_OPTIONS as transport}
            <button 
              class="card bg-base-200 hover:bg-base-300 transition-all duration-200 cursor-pointer border-2 text-left"
              class:border-primary={selectedTransport === transport}
              class:border-transparent={selectedTransport !== transport}
              on:click={() => selectedTransport = transport}
            >
              <div class="card-body flex flex-row items-center gap-4 p-6">
                <span class="text-5xl">{transport.emoji}</span>
                <div>
                    <h3 class="font-bold text-lg">{transport.label}</h3>
                    <p class="text-sm opacity-70">{transport.description}</p>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Step 4: Summary -->
    {#if step === 4}
      <div in:fade class="space-y-8 text-center">
        <div class="space-y-2">
            <h2 class="text-3xl font-black text-primary">You are ready to go! 🎉</h2>
            <p class="text-xl">Here is your trip plan.</p>
        </div>

        <div class="card bg-base-200 border-2 border-primary/20 max-w-md mx-auto" id="printable-plan">
            <div class="card-body text-left space-y-4">
                
                <!-- Header for Print only -->
                <div class="hidden print:block text-center border-b-2 border-primary pb-4 mb-4">
                    <h1 class="text-2xl font-black text-primary">My Trip Plan</h1>
                    <p class="text-sm opacity-70">Getting Around Town</p>
                </div>

                <!-- Destination -->
                <div class="flex items-center gap-4 border-b border-base-content/10 pb-4">
                    <div class="text-4xl bg-base-100 p-3 rounded-xl">{selectedPlace.emoji}</div>
                    <div>
                        <div class="text-xs uppercase font-bold opacity-50">Destination</div>
                        <div class="text-xl font-bold">{selectedPlace.label}</div>
                    </div>
                </div>

                <!-- Transport -->
                <div class="flex items-center gap-4 border-b border-base-content/10 pb-4">
                    <div class="text-4xl bg-base-100 p-3 rounded-xl">{selectedTransport.emoji}</div>
                    <div>
                        <div class="text-xs uppercase font-bold opacity-50">Travel By</div>
                        <div class="text-xl font-bold">{selectedTransport.label}</div>
                    </div>
                </div>

                <!-- Items -->
                <div>
                    <div class="text-xs uppercase font-bold opacity-50 mb-2">In Your Bag</div>
                    <div class="flex flex-wrap gap-2">
                        {#each selectedItems as item}
                            <span class="badge badge-lg badge-outline gap-2 py-3">
                                <span>{item.emoji}</span> {item.label}
                            </span>
                        {/each}
                        {#if selectedItems.length === 0}
                            <span class="text-sm opacity-50 italic">Nothing packed!</span>
                        {/if}
                    </div>
                </div>

            </div>
        </div>

        <div class="alert alert-info shadow-lg max-w-md mx-auto text-left">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                    <h3 class="font-bold">Safety Tip:</h3>
                    <div class="text-sm">
                        {selectedTransport.tips[Math.floor(Math.random() * selectedTransport.tips.length)]}
                    </div>
                </div>
            </div>
        </div>

      </div>
    {/if}

  </div>

  <!-- Navigation Buttons -->
  <div class="flex justify-between pt-4">
    {#if step > 1}
        <button class="btn btn-ghost gap-2" on:click={step === 4 ? resetTrip : prevStep}>
            {#if step === 4}
                Start Over
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Back
            {/if}
        </button>
    {:else}
        <div></div>
    {/if}

    {#if step < 4}
        <button class="btn btn-primary gap-2 px-8" on:click={nextStep}>
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
        </button>
    {:else}
        <button class="btn btn-success gap-2 px-8" on:click={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
            </svg>
            Print Plan
        </button>
    {/if}
  </div>

</div>
