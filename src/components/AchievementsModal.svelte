<!--
  Achievements modal: shows the player their level, XP progress, star
  collection per module, and badge grid (earned + locked-with-hint).
  All gamification state already lives in progressStore — this is the
  visual surface for it.
-->
<script>
  import { fade, scale } from "svelte/transition";
  import {
    studentProfile,
    stickersStore,
    progressStore,
    BADGE_KEYS,
    STAR_KEYS,
  } from "../stores/progressStore.js";
  import { LEVEL_NAMES, XP_LEVEL_2, XP_LEVEL_3 } from "../config.js";
  import { focusTrap } from "../lib/focusTrap.js";
  import Icon from "./Icon.svelte";

  export let isOpen = false;
  export let onClose = () => {};

  const STAR_MODULES = [
    { key: "helpVisitorStars",  emoji: "🗣️", label: "Helper Stars",   tint: "from-primary/15 to-primary/5",     text: "text-primary"   },
    { key: "safeWalkStars",     emoji: "📋", label: "Sequence Stars", tint: "from-secondary/15 to-secondary/5", text: "text-secondary" },
    { key: "shortQAStars",      emoji: "❓", label: "Q&A Stars",      tint: "from-accent/15 to-accent/5",       text: "text-accent"    },
    { key: "mapQuestStars",     emoji: "🗺️", label: "Quest Stars",    tint: "from-info/15 to-info/5",           text: "text-info"      },
    { key: "learnPlacesStars",  emoji: "📚", label: "Explorer Stars", tint: "from-success/15 to-success/5",     text: "text-success"   },
  ];

  const BADGES = {
    firstAdventure: { emoji: "🌱", name: "First Adventure", earned: "You started your journey!",        locked: "Complete any activity once."        },
    perfectScore:   { emoji: "💯", name: "Perfect Score",   earned: "You got every answer right!",      locked: "Get 100% in any session."           },
    helpfulHero:    { emoji: "🦸", name: "Helpful Hero",    earned: "You helped lots of visitors!",     locked: "Finish Help the Visitor 20 times."  },
    sequenceMaster: { emoji: "📋", name: "Sequence Master", earned: "You mastered daily sequences!",    locked: "Finish Daily Sequences 3 times."    },
    questionMaster: { emoji: "🎓", name: "Question Master", earned: "You answered tons of questions!",  locked: "Get 30 Short Q&A answers right."    },
    mapMaster:      { emoji: "🗺️", name: "Map Master",      earned: "You read the map like an explorer!", locked: "Finish Map Quest 3 times."        },
    explorerBadge:  { emoji: "📚", name: "Super Explorer",  earned: "You learned about lots of places!", locked: "Visit 10 places in Learn Places."  },
    weekWarrior:    { emoji: "🔥", name: "Week Warrior",    earned: "You played 7 days in a row!",      locked: "Play every day for a week."         },
    completionist:  { emoji: "🏆", name: "Completionist",   earned: "You earned EVERY badge!",          locked: "Earn all the other badges."         },
  };

  $: totalStars = STAR_KEYS.reduce((sum, k) => sum + ($stickersStore[k] ?? 0), 0);
  $: earnedBadgeCount = [...BADGE_KEYS, "completionist"].filter(k => $stickersStore[k]).length;
  $: totalBadgeCount = BADGE_KEYS.length + 1;

  $: level = $studentProfile.level ?? 1;
  $: xp = $studentProfile.xp ?? 0;

  // XP toward the next level. At max level, the bar shows "MAX".
  $: levelLabel = LEVEL_NAMES[level] ?? "Player";
  $: nextLevelXp = level === 1 ? XP_LEVEL_2 : level === 2 ? XP_LEVEL_3 : null;
  $: levelFloor  = level === 1 ? 0 : level === 2 ? XP_LEVEL_2 : XP_LEVEL_3;
  $: levelProgress = nextLevelXp
       ? Math.max(0, Math.min(100, ((xp - levelFloor) / (nextLevelXp - levelFloor)) * 100))
       : 100;
  $: xpToNext = nextLevelXp ? Math.max(0, nextLevelXp - xp) : 0;

  // Show streak progress toward the Week Warrior badge.
  $: streak = $stickersStore.dailyStreak ?? 0;
  $: bestStreak = $stickersStore.bestStreak ?? 0;

  function handleKeydown(event) {
    if (event.key === "Escape") onClose();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="achievements-title"
    transition:fade={{ duration: 180 }}
  >
    <button
      type="button"
      class="absolute inset-0 bg-base-content/40 backdrop-blur-sm"
      on:click={onClose}
      aria-label="Close achievements"
      tabindex="-1"
    ></button>
    <div
      class="relative z-10 max-w-2xl w-full bg-base-100 shadow-2xl border border-base-200/50 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
      transition:scale={{ start: 0.95, duration: 220 }}
      use:focusTrap
    >
      <!-- Header -->
      <header
        class="bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/10 px-6 py-5 border-b border-base-200 flex items-center justify-between flex-shrink-0"
      >
        <div class="flex items-center gap-3">
          <div class="text-3xl" aria-hidden="true">🏆</div>
          <div>
            <h2 id="achievements-title" class="text-xl font-black text-base-content tracking-tight">
              My Achievements
            </h2>
            <p class="text-xs text-base-content/60 font-medium">Collect them all!</p>
          </div>
        </div>
        <button
          class="btn btn-sm btn-circle btn-ghost hover:bg-base-200"
          on:click={onClose}
          aria-label="Close achievements"
        >
          <Icon name="close" />
        </button>
      </header>

      <!-- Scrollable body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Profile / Level -->
        <section class="bg-base-200/40 rounded-2xl p-5 border border-base-200">
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center text-3xl shadow-inner"
              aria-hidden="true"
            >
              {$studentProfile.avatar || "🧒"}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2 flex-wrap">
                <p class="font-bold text-base-content truncate">
                  {$studentProfile.name?.trim() || $studentProfile.characterName || "Explorer"}
                </p>
                <span class="badge badge-primary badge-sm font-semibold">Level {level}</span>
              </div>
              <p class="text-sm text-base-content/60">{levelLabel}</p>
            </div>
          </div>

          <div class="mt-4">
            <div class="flex items-center justify-between text-xs font-medium text-base-content/60 mb-1.5">
              <span>{xp} XP</span>
              {#if nextLevelXp}
                <span>{xpToNext} XP to Level {level + 1}</span>
              {:else}
                <span class="text-success font-semibold">MAX LEVEL!</span>
              {/if}
            </div>
            <div
              class="h-3 w-full bg-base-300 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(levelProgress)}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Progress to next level"
            >
              <div
                class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out"
                style="width: {levelProgress}%"
              ></div>
            </div>
          </div>
        </section>

        <!-- Quick stats -->
        <section class="grid grid-cols-3 gap-3" aria-label="Summary">
          <div class="bg-base-100 rounded-2xl p-4 text-center border border-base-200/70 shadow-sm">
            <div class="text-2xl font-black text-accent">{totalStars}</div>
            <div class="text-xs text-base-content/60 font-medium uppercase tracking-wide mt-0.5">Total Stars</div>
          </div>
          <div class="bg-base-100 rounded-2xl p-4 text-center border border-base-200/70 shadow-sm">
            <div class="text-2xl font-black text-secondary">{earnedBadgeCount}<span class="text-base text-base-content/40 font-bold">/{totalBadgeCount}</span></div>
            <div class="text-xs text-base-content/60 font-medium uppercase tracking-wide mt-0.5">Badges</div>
          </div>
          <div class="bg-base-100 rounded-2xl p-4 text-center border border-base-200/70 shadow-sm">
            <div class="text-2xl font-black text-warning flex items-center justify-center gap-1">
              {streak}<span class="text-xl" aria-hidden="true">🔥</span>
            </div>
            <div class="text-xs text-base-content/60 font-medium uppercase tracking-wide mt-0.5">Day Streak</div>
            <div class="text-[10px] text-base-content/40 mt-0.5">Best: {bestStreak}</div>
          </div>
        </section>

        <!-- Star counters per module -->
        <section>
          <h3 class="text-sm font-bold uppercase tracking-wider text-base-content/60 mb-3 flex items-center gap-2">
            <span aria-hidden="true">⭐</span> My Stars
          </h3>
          <ul class="grid grid-cols-2 sm:grid-cols-5 gap-2.5" aria-label="Star counters">
            {#each STAR_MODULES as mod (mod.key)}
              <li
                class="bg-gradient-to-br {mod.tint} rounded-xl p-3 text-center border border-base-200/50"
              >
                <div class="text-2xl mb-1" aria-hidden="true">{mod.emoji}</div>
                <div class="text-xl font-black {mod.text}">{$stickersStore[mod.key] ?? 0}</div>
                <div class="text-[10px] text-base-content/60 font-semibold mt-0.5 leading-tight">{mod.label}</div>
              </li>
            {/each}
          </ul>
        </section>

        <!-- Badges -->
        <section>
          <h3 class="text-sm font-bold uppercase tracking-wider text-base-content/60 mb-3 flex items-center gap-2">
            <span aria-hidden="true">🏅</span> Badges
            <span class="badge badge-ghost badge-sm font-semibold ml-auto">{earnedBadgeCount} of {totalBadgeCount}</span>
          </h3>
          <ul class="grid grid-cols-2 sm:grid-cols-3 gap-3" aria-label="Achievement badges">
            {#each [...BADGE_KEYS, "completionist"] as key (key)}
              {@const badge = BADGES[key]}
              {@const earned = !!$stickersStore[key]}
              <li
                class="relative rounded-2xl p-4 text-center transition-all duration-300 border-2
                  {earned
                    ? 'bg-gradient-to-br from-warning/15 via-accent/10 to-primary/10 border-accent/40 shadow-md'
                    : 'bg-base-200/40 border-base-200 opacity-70'}"
                aria-label="{badge.name}: {earned ? 'earned' : 'locked'}"
              >
                <div
                  class="text-4xl mb-2 transition-transform duration-300 {earned ? '' : 'grayscale'}"
                  aria-hidden="true"
                >
                  {badge.emoji}
                </div>
                <div class="font-bold text-sm text-base-content leading-tight">
                  {badge.name}
                </div>
                <p class="text-[11px] text-base-content/60 mt-1 leading-snug min-h-[2.4em]">
                  {earned ? badge.earned : badge.locked}
                </p>
                <span
                  class="absolute -top-1.5 -right-1.5 text-base flex items-center justify-center w-6 h-6 rounded-full shadow-sm
                    {earned ? 'bg-success text-success-content' : 'bg-base-300 text-base-content/50'}"
                  aria-hidden="true"
                >
                  {earned ? "✓" : "🔒"}
                </span>
              </li>
            {/each}
          </ul>
        </section>
      </div>

      <!-- Footer -->
      <footer class="px-5 py-4 border-t border-base-200 flex gap-3 flex-shrink-0">
        <button
          class="btn btn-ghost flex-1 rounded-xl font-medium"
          on:click={onClose}
        >
          Close
        </button>
        <button
          class="btn btn-primary flex-1 rounded-xl font-bold"
          on:click={onClose}
        >
          Keep Learning! 🚀
        </button>
      </footer>
    </div>
  </div>
{/if}
