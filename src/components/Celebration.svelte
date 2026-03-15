<!-- 
  Celebration Component
  Shows confetti and celebration animations for achievements
  Designed to provide positive reinforcement for young learners
-->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { reducedMotionStore } from '../stores.js';
  import { fade, scale } from 'svelte/transition';
  
  export let show = false;
  export let type = 'success'; // success, perfect, badge, stars
  export let message = 'Great job!';
  export let emoji = '🎉';
  export let duration = 3000;
  export let onComplete = () => {};
  
  let confettiCanvas;
  let confettiInterval;
  
  // Celebration configurations
  const celebrations = {
    success: {
      emoji: '🎉',
      emojis: ['⭐', '✨', '🌟', '💫'],
      message: 'Great job!',
      bgColor: 'from-success/20 to-primary/20'
    },
    perfect: {
      emoji: '🏆',
      emojis: ['🎯', '💯', '🌟', '👑', '🎊'],
      message: 'Perfect!',
      bgColor: 'from-accent/20 to-warning/20'
    },
    badge: {
      emoji: '🏅',
      emojis: ['🎁', '⭐', '✨', '🌈'],
      message: 'New Badge!',
      bgColor: 'from-secondary/20 to-primary/20'
    },
    stars: {
      emoji: '⭐',
      emojis: ['⭐', '🌟', '✨', '💛'],
      message: 'Stars Earned!',
      bgColor: 'from-warning/20 to-accent/20'
    }
  };
  
  $: config = celebrations[type] || celebrations.success;
  $: displayEmoji = emoji || config.emoji;
  $: displayMessage = message || config.message;
  
  // Confetti particles
  let particles = [];
  
  function createConfetti() {
    if ($reducedMotionStore || typeof window === 'undefined') return;
    
    // Create floating emoji particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      emoji: config.emojis[Math.floor(Math.random() * config.emojis.length)],
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      size: 1 + Math.random() * 1.5,
      speed: 2 + Math.random() * 3,
      wobble: Math.random() * 360,
      wobbleSpeed: 2 + Math.random() * 3
    }));
    
    particles = [...particles, ...newParticles];
    
    // Animate particles
    const animate = () => {
      particles = particles
        .map(p => ({
          ...p,
          y: p.y - p.speed * 0.5,
          wobble: p.wobble + p.wobbleSpeed,
          x: p.x + Math.sin(p.wobble * Math.PI / 180) * 0.5
        }))
        .filter(p => p.y > -10);
    };
    
    confettiInterval = setInterval(animate, 50);
  }
  
  $: if (show) {
    createConfetti();
    setTimeout(() => {
      show = false;
      onComplete();
    }, duration);
  }
  
  onDestroy(() => {
    if (confettiInterval) clearInterval(confettiInterval);
  });
</script>

{#if show}
  <div 
    class="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
    transition:fade={{ duration: 200 }}
  >
    <!-- Confetti particles -->
    {#if !$reducedMotionStore}
      <div class="absolute inset-0 overflow-hidden">
        {#each particles as particle (particle.id)}
          <div 
            class="absolute transition-none"
            style="
              left: {particle.x}%;
              top: {particle.y}%;
              font-size: {particle.size}rem;
              transform: rotate({particle.wobble}deg);
            "
          >
            {particle.emoji}
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- Central celebration message -->
    <div 
      class="bg-gradient-to-br {config.bgColor} backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/30 text-center max-w-sm mx-4"
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

<style>
  /* Optimize confetti performance */
  :global(.celebration-particle) {
    will-change: transform;
    backface-visibility: hidden;
  }
</style>
