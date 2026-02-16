<script>
  import { PLACES } from '../data/places.js';
  import { PACKING_ITEMS, TRANSPORT_OPTIONS } from '../data/tripData.js';
  import { fade, fly, slide, scale } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { toastStore } from '../stores.js';

  const dispatch = createEventDispatcher();

  let step = 1;
  let selectedPlace = null;
  let selectedItems = [];
  let selectedTransport = null;
  let safetyTipIndex = 0;

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
    if (step === 4 && selectedTransport) {
      safetyTipIndex = Math.floor(Math.random() * selectedTransport.tips.length);
    }
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

<div class="max-w-3xl mx-auto space-y-8">
  
  <!-- Header -->
  <div class="space-y-2">
    <div class="flex items-center gap-4 mb-2">
      <button class="btn btn-circle btn-ghost bg-base-100 shadow-sm hover:shadow-md hover:bg-base-200 transition-all" on:click={() => dispatch('back')} aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </button>
      <div>
        <h1 class="text-3xl sm:text-4xl font-black text-base-content">
          <span class="text-gradient">Trip</span> Planner
        </h1>
        <p class="text-base sm:text-lg text-base-content/60">Let's get ready for an outing!</p>
      </div>
    </div>
  </div>

  <!-- Steps Indicator -->
  <div class="w-full overflow-x-auto pb-2 -mx-4 px-4">
      <ul class="steps steps-horizontal w-full min-w-[450px] text-sm">
        <li class="step font-medium" class:step-primary={step >= 1}>Pick Destination</li>
        <li class="step font-medium" class:step-primary={step >= 2}>Pack Bag</li>
        <li class="step font-medium" class:step-primary={step >= 3}>Choose Travel</li>
        <li class="step font-medium" class:step-primary={step >= 4}>Ready!</li>
      </ul>
  </div>

  <!-- Content Area -->
  <div class="bg-base-100 rounded-2xl shadow-soft p-5 sm:p-8 min-h-[350px] border border-base-200/50">
    
    <!-- Step 1: Destination -->
    {#if step === 1}
      <div in:fade class="space-y-5">
        <h2 class="text-xl font-bold text-center text-base-content">Where do you want to go today?</h2>
        
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {#each destinations as place}
            <button 
              class="card bg-base-200/50 hover:bg-base-200 transition-all duration-200 cursor-pointer border-2 rounded-xl"
              class:border-primary={selectedPlace === place}
              class:shadow-sm={selectedPlace === place}
              class:border-transparent={selectedPlace !== place}
              on:click={() => selectedPlace = place}
            >
              <div class="card-body items-center text-center p-3 sm:p-4">
                <span class="text-3xl sm:text-4xl mb-1">{place.emoji}</span>
                <h3 class="font-semibold text-xs sm:text-sm">{place.label}</h3>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Step 2: Packing -->
    {#if step === 2}
      <div in:fade class="space-y-5">
        <div class="text-center space-y-1">
            <h2 class="text-xl font-bold text-base-content">What do you need to bring?</h2>
            <p class="text-sm text-base-content/60">Select the items to put in your bag.</p>
        </div>
        
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {#each PACKING_ITEMS as item}
            <button 
              class="card bg-base-200/50 hover:bg-base-200 transition-all duration-200 cursor-pointer border-2 relative overflow-hidden rounded-xl"
              class:border-primary={selectedItems.includes(item)}
              class:shadow-sm={selectedItems.includes(item)}
              class:border-transparent={!selectedItems.includes(item)}
              on:click={() => toggleItem(item)}
            >
              {#if selectedItems.includes(item)}
                <div class="absolute top-1.5 right-1.5 text-primary" in:scale>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
              {/if}
              <div class="card-body items-center text-center p-3 sm:p-4">
                <span class="text-3xl sm:text-4xl mb-1">{item.emoji}</span>
                <h3 class="font-semibold text-xs sm:text-sm">{item.label}</h3>
                {#if item.required}
                    <span class="badge badge-warning badge-xs mt-1 font-semibold">Important</span>
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Step 3: Transport -->
    {#if step === 3}
      <div in:fade class="space-y-5">
        <h2 class="text-xl font-bold text-center text-base-content">How will you get there?</h2>
        
        <div class="grid gap-3">
          {#each TRANSPORT_OPTIONS as transport}
            <button 
              class="card bg-base-200/50 hover:bg-base-200 transition-all duration-200 cursor-pointer border-2 text-left rounded-xl"
              class:border-primary={selectedTransport === transport}
              class:shadow-sm={selectedTransport === transport}
              class:border-transparent={selectedTransport !== transport}
              on:click={() => selectedTransport = transport}
            >
              <div class="card-body flex flex-row items-center gap-4 p-4 sm:p-5">
                <span class="text-4xl">{transport.emoji}</span>
                <div>
                    <h3 class="font-bold text-base">{transport.label}</h3>
                    <p class="text-sm text-base-content/60">{transport.description}</p>
                </div>
                {#if selectedTransport === transport}
                  <div class="ml-auto text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Step 4: Summary -->
    {#if step === 4}
      <div in:fade class="space-y-6 text-center">
        <div class="space-y-2">
            <div class="text-4xl mb-2">🎉</div>
            <h2 class="text-2xl font-bold text-base-content">You're ready to go!</h2>
            <p class="text-base-content/60">Here's your trip plan.</p>
        </div>

        <div class="card bg-base-200/50 border border-base-200 max-w-sm mx-auto rounded-xl" id="printable-plan">
            <div class="card-body text-left space-y-4 p-5">
                
                <!-- Header for Print only -->
                <div class="hidden print:block text-center border-b-2 border-primary pb-4 mb-4">
                    <h1 class="text-2xl font-black text-primary">My Trip Plan</h1>
                    <p class="text-sm opacity-70">Getting Around Town</p>
                </div>

                <!-- Destination -->
                <div class="flex items-center gap-3 border-b border-base-300/50 pb-4">
                    <div class="text-3xl bg-base-100 p-2.5 rounded-xl shadow-sm">{selectedPlace.emoji}</div>
                    <div>
                        <div class="text-xs uppercase font-semibold text-base-content/50">Destination</div>
                        <div class="text-lg font-bold">{selectedPlace.label}</div>
                    </div>
                </div>

                <!-- Transport -->
                <div class="flex items-center gap-3 border-b border-base-300/50 pb-4">
                    <div class="text-3xl bg-base-100 p-2.5 rounded-xl shadow-sm">{selectedTransport.emoji}</div>
                    <div>
                        <div class="text-xs uppercase font-semibold text-base-content/50">Travel By</div>
                        <div class="text-lg font-bold">{selectedTransport.label}</div>
                    </div>
                </div>

                <!-- Items -->
                <div>
                    <div class="text-xs uppercase font-semibold text-base-content/50 mb-2">In Your Bag</div>
                    <div class="flex flex-wrap gap-1.5">
                        {#each selectedItems as item}
                            <span class="badge badge-outline gap-1.5 py-2.5 font-medium">
                                <span>{item.emoji}</span> {item.label}
                            </span>
                        {/each}
                        {#if selectedItems.length === 0}
                            <span class="text-sm text-base-content/50 italic">Nothing packed!</span>
                        {/if}
                    </div>
                </div>

            </div>
        </div>

        <div class="alert bg-info/10 border border-info/20 shadow-sm max-w-sm mx-auto text-left rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
                <h3 class="font-bold text-sm text-info">Safety Tip</h3>
                <div class="text-xs text-base-content/70">
                    {selectedTransport.tips[safetyTipIndex]}
                </div>
            </div>
        </div>

      </div>
    {/if}

  </div>

  <!-- Navigation Buttons -->
  <div class="flex justify-between pt-2">
    {#if step > 1}
        <button class="btn btn-ghost gap-2 rounded-xl font-medium" on:click={step === 4 ? resetTrip : prevStep}>
            {#if step === 4}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Start Over
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Back
            {/if}
        </button>
    {:else}
        <div></div>
    {/if}

    {#if step < 4}
        <button class="btn btn-primary gap-2 px-6 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all" on:click={nextStep}>
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
        </button>
    {:else}
        <button class="btn btn-success gap-2 px-6 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all" on:click={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
            </svg>
            Print Plan
        </button>
    {/if}
  </div>

</div>
