<!-- 
  Text-to-Speech Button Component
  Accessibility feature for young learners
  WCAG 2.2 compliant with visual feedback
-->
<script>
  import { reducedMotionStore } from '../stores.js';
  
  export let text = '';
  export let label = 'Read aloud';
  export let size = 'md'; // sm, md, lg
  export let variant = 'ghost'; // ghost, primary, secondary
  
  let isSpeaking = false;
  let isSupported = false;
  
  // Check browser support on mount
  import { onMount } from 'svelte';
  onMount(() => {
    isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  });
  
  function speak() {
    if (!isSupported || !text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure for young learners - slower, clearer speech
    utterance.rate = 0.85;  // Slightly slower for comprehension
    utterance.pitch = 1.1;  // Slightly higher, more engaging
    utterance.volume = 1;
    
    // Try to use a child-friendly voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Zira') ||
      v.name.includes('Google US English') ||
      (v.lang === 'en-US' && !v.name.includes('Male'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => { isSpeaking = true; };
    utterance.onend = () => { isSpeaking = false; };
    utterance.onerror = () => { isSpeaking = false; };
    
    window.speechSynthesis.speak(utterance);
  }
  
  function stop() {
    if (isSupported) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
    }
  }
  
  // Size classes
  $: sizeClasses = {
    sm: 'btn-sm h-8 w-8 min-h-0',
    md: 'btn-md h-10 w-10 min-h-0',
    lg: 'btn-lg h-12 w-12 min-h-0'
  }[size];
  
  $: iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }[size];
  
  $: variantClasses = {
    ghost: 'btn-ghost hover:bg-primary/10',
    primary: 'btn-primary',
    secondary: 'btn-secondary'
  }[variant];
</script>

{#if isSupported}
  <button
    type="button"
    class="btn btn-circle {sizeClasses} {variantClasses} transition-all duration-200 {isSpeaking && !$reducedMotionStore ? 'animate-pulse' : ''}"
    class:ring-2={isSpeaking}
    class:ring-primary={isSpeaking}
    class:ring-offset-2={isSpeaking}
    on:click={isSpeaking ? stop : speak}
    aria-label={isSpeaking ? 'Stop reading' : label}
    title={isSpeaking ? 'Click to stop' : label}
  >
    {#if isSpeaking}
      <!-- Stop icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="{iconSize}" fill="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="2"/>
      </svg>
    {:else}
      <!-- Speaker icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="{iconSize}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    {/if}
  </button>
{/if}
