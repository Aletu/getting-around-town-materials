<!-- 
  Sticker Book Component
  Gamification: Collectible achievements displayed as stickers
  Designed for 3rd graders - visual, fun, rewarding
-->
<script>
  import { stickersStore, progressStore, calculateOverallProgress } from '../stores/progressStore.js';
  import { fade, scale, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  
  export let isOpen = false;
  export let onClose = () => {};
  
  // All available stickers with metadata
  const stickerDefinitions = {
    // Module stars (displayed differently)
    helpVisitorStars: { 
      emoji: '⭐', 
      name: 'Helper Stars', 
      description: 'Earned by helping visitors!',
      type: 'counter'
    },
    safeWalkStars: { 
      emoji: '⭐', 
      name: 'Safe Walk Stars', 
      description: 'Earned by planning safe routes!',
      type: 'counter'
    },
    shortQAStars: { 
      emoji: '⭐', 
      name: 'Q&A Stars', 
      description: 'Earned by answering questions!',
      type: 'counter'
    },
    tripPlannerStars: { 
      emoji: '⭐', 
      name: 'Trip Stars', 
      description: 'Earned by planning trips!',
      type: 'counter'
    },
    learnPlacesStars: { 
      emoji: '⭐', 
      name: 'Explorer Stars', 
      description: 'Earned by learning places!',
      type: 'counter'
    },
    
    // Achievement stickers
    firstAdventure: { 
      emoji: '🎒', 
      name: 'First Adventure', 
      description: 'You started your journey!',
      type: 'badge'
    },
    perfectScore: { 
      emoji: '💯', 
      name: 'Perfect Score', 
      description: 'Got everything right!',
      type: 'badge'
    },
    explorerBadge: { 
      emoji: '🗺️', 
      name: 'Super Explorer', 
      description: 'Learned all the places!',
      type: 'badge'
    },
    safetyChampion: { 
      emoji: '🛡️', 
      name: 'Safety Champion', 
      description: 'Expert at safe walking!',
      type: 'badge'
    },
    helpfulHero: { 
      emoji: '🦸', 
      name: 'Helpful Hero', 
      description: 'Helped lots of visitors!',
      type: 'badge'
    },
    superNavigator: { 
      emoji: '🧭', 
      name: 'Super Navigator', 
      description: 'Planned many trips!',
      type: 'badge'
    },
    questionMaster: { 
      emoji: '🎓', 
      name: 'Question Master', 
      description: 'Answered so many questions!',
      type: 'badge'
    },
    completionist: { 
      emoji: '🏆', 
      name: 'Completionist', 
      description: 'Earned ALL the stickers!',
      type: 'badge'
    }
  };
  
  // Separate badges from counters
  $: badgeStickers = Object.entries(stickerDefinitions)
    .filter(([_, def]) => def.type === 'badge');
  
  $: counterStickers = Object.entries(stickerDefinitions)
    .filter(([_, def]) => def.type === 'counter');
  
  // Calculate total stars
  $: totalStars = 
    ($stickersStore.helpVisitorStars || 0) +
    ($stickersStore.safeWalkStars || 0) +
    ($stickersStore.shortQAStars || 0) +
    ($stickersStore.tripPlannerStars || 0) +
    ($stickersStore.learnPlacesStars || 0);
  
  // Calculate earned badges count
  $: earnedBadges = badgeStickers.filter(([key, _]) => $stickersStore[key]).length;
  $: totalBadges = badgeStickers.length;
  
  // Overall progress
  $: overallProgress = calculateOverallProgress($progressStore);
  
  // Handle escape key
  function handleKeydown(e) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div 
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    on:click|self={onClose}
    transition:fade={{ duration: 200 }}
    role="dialog"
    aria-modal="true"
    aria-labelledby="sticker-book-title"
  >
    <!-- Modal -->
    <div 
      class="bg-base-100 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
      transition:scale={{ duration: 300, start: 0.9 }}
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-6 border-b border-base-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="text-5xl animate-bounce" style="animation-duration: 2s;">📚</div>
            <div>
              <h2 id="sticker-book-title" class="text-2xl font-black text-base-content">My Sticker Book</h2>
              <p class="text-base-content/60">Collect them all!</p>
            </div>
          </div>
          <button 
            class="btn btn-circle btn-ghost"
            on:click={onClose}
            aria-label="Close sticker book"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Progress Overview -->
        <div class="mt-4 grid grid-cols-3 gap-4 text-center">
          <div class="bg-base-100/60 rounded-xl p-3">
            <div class="text-2xl font-black text-accent">{totalStars}</div>
            <div class="text-xs text-base-content/60 font-medium">Total Stars</div>
          </div>
          <div class="bg-base-100/60 rounded-xl p-3">
            <div class="text-2xl font-black text-secondary">{earnedBadges}/{totalBadges}</div>
            <div class="text-xs text-base-content/60 font-medium">Badges</div>
          </div>
          <div class="bg-base-100/60 rounded-xl p-3">
            <div class="text-2xl font-black text-primary">{overallProgress}%</div>
            <div class="text-xs text-base-content/60 font-medium">Complete</div>
          </div>
        </div>
      </div>
      
      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8">
        
        <!-- Daily Streak -->
        <div class="bg-gradient-to-r from-warning/10 to-accent/10 rounded-2xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-3xl">🔥</div>
              <div>
                <div class="font-bold text-base-content">Daily Streak</div>
                <div class="text-sm text-base-content/60">Keep playing every day!</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-black text-warning">{$stickersStore.dailyStreak || 0}</div>
              <div class="text-xs text-base-content/50">Best: {$stickersStore.bestStreak || 0}</div>
            </div>
          </div>
        </div>
        
        <!-- Star Counters -->
        <div>
          <h3 class="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
            <span class="text-xl">⭐</span> My Stars
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {#each counterStickers as [key, def]}
              <div class="bg-base-200/50 rounded-xl p-4 text-center hover:bg-base-200 transition-colors">
                <div class="text-3xl mb-2">{def.emoji}</div>
                <div class="font-bold text-xl text-accent">{$stickersStore[key] || 0}</div>
                <div class="text-xs text-base-content/60">{def.name}</div>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Achievement Badges -->
        <div>
          <h3 class="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
            <span class="text-xl">🏅</span> Achievement Badges
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {#each badgeStickers as [key, def]}
              {@const earned = $stickersStore[key]}
              <div 
                class="relative group rounded-2xl p-4 text-center transition-all duration-300 border-2
                  {earned ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30' : 'bg-base-200/30 border-base-300 grayscale opacity-50'}"
              >
                <div class="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">
                  {def.emoji}
                </div>
                <div class="font-bold text-sm text-base-content">{def.name}</div>
                <div class="text-xs text-base-content/60 mt-1">{def.description}</div>
                
                {#if earned}
                  <div class="absolute -top-2 -right-2 text-lg">✓</div>
                {:else}
                  <div class="absolute -top-2 -right-2 text-lg">🔒</div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
        
      </div>
      
      <!-- Footer -->
      <div class="p-4 border-t border-base-200 bg-base-100">
        <button 
          class="btn btn-primary w-full rounded-xl font-bold"
          on:click={onClose}
        >
          Keep Learning! 🚀
        </button>
      </div>
    </div>
  </div>
{/if}
