<!--
  Celebration overlay: centered message with emoji + canvas-confetti burst.
  Parent owns the `show` flag and clears it via `onComplete`.
-->
<script>
  import { onDestroy } from 'svelte';
  import { reducedMotionStore } from '../stores.js';
  import { fade, scale } from 'svelte/transition';
  import confetti from 'canvas-confetti';

  export let show = false;
  export let type = 'success'; // success, perfect, badge, stars
  export let message = 'Great job!';
  export let emoji = '🎉';
  export let duration = 3000;
  export let onComplete = () => {};

  let hideTimer;

  const celebrations = {
    success: { emoji: '🎉', message: 'Great job!',  bgColor: 'from-success/20 to-primary/20'   },
    perfect: { emoji: '🏆', message: 'Perfect!',    bgColor: 'from-accent/20 to-warning/20'    },
    badge:   { emoji: '🏅', message: 'New Badge!',  bgColor: 'from-secondary/20 to-primary/20' },
    stars:   { emoji: '⭐', message: 'Stars Earned!', bgColor: 'from-warning/20 to-accent/20'  },
  };

  $: config = celebrations[type] || celebrations.success;
  $: displayEmoji = emoji || config.emoji;
  $: displayMessage = message || config.message;

  function fireConfetti() {
    if ($reducedMotionStore || typeof window === 'undefined') return;
    const base = { spread: 70, origin: { y: 0.6 } };
    confetti({ ...base, particleCount: type === 'perfect' ? 200 : 120 });
  }

  // Schedule auto-hide whenever `show` flips to true.
  $: if (show) {
    fireConfetti();
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => onComplete(), duration);
  }

  onDestroy(() => {
    if (hideTimer) clearTimeout(hideTimer);
  });
</script>

{#if show}
  <div
    class="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
    transition:fade={{ duration: 200 }}
  >
    <div
      class="bg-gradient-to-br {config.bgColor} backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/30 text-center max-w-sm mx-4"
      role="status"
      aria-live="polite"
      transition:scale={{ duration: 400, start: 0.5 }}
    >
      <div
        class="text-7xl sm:text-8xl mb-4"
        class:animate-bounce={!$reducedMotionStore}
        style="animation-duration: 0.8s;"
      >
        {displayEmoji}
      </div>
      <h2 class="text-2xl sm:text-3xl font-black text-base-content mb-2">
        {displayMessage}
      </h2>
      <p class="text-base-content/60">Keep up the great work!</p>
    </div>
  </div>
{/if}
