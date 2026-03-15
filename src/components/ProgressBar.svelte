<!-- 
  Kid-Friendly Progress Bar Component
  Visual progress indicator with fun animations
  Designed for 3rd graders - large, colorful, encouraging
-->
<script>
  import { reducedMotionStore } from '../stores.js';
  
  export let value = 0; // 0-100
  export let max = 100;
  export let showLabel = true;
  export let size = 'md'; // sm, md, lg
  export let color = 'primary'; // primary, secondary, accent, success
  export let showMilestones = false;
  export let animated = true;
  
  $: percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  $: roundedPercentage = Math.round(percentage);
  
  // Milestone markers (25%, 50%, 75%, 100%)
  const milestones = [25, 50, 75, 100];
  
  // Size configurations
  $: heightClass = {
    sm: 'h-3',
    md: 'h-5',
    lg: 'h-8'
  }[size];
  
  $: textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];
  
  // Color configurations
  $: barColor = {
    primary: 'bg-gradient-to-r from-primary to-primary/80',
    secondary: 'bg-gradient-to-r from-secondary to-secondary/80',
    accent: 'bg-gradient-to-r from-accent to-accent/80',
    success: 'bg-gradient-to-r from-success to-success/80'
  }[color];
  
  // Encouragement messages based on progress
  $: encouragement = percentage < 25 ? 'Great start!' :
                     percentage < 50 ? 'Keep going!' :
                     percentage < 75 ? 'Almost there!' :
                     percentage < 100 ? 'So close!' :
                     'Amazing! 🎉';
</script>

<div class="w-full space-y-2">
  <!-- Labels -->
  {#if showLabel}
    <div class="flex justify-between items-center {textSize}">
      <span class="font-semibold text-base-content">{roundedPercentage}%</span>
      <span class="text-base-content/60 font-medium">{encouragement}</span>
    </div>
  {/if}
  
  <!-- Progress bar container -->
  <div class="relative">
    <div class="{heightClass} w-full bg-base-200 rounded-full overflow-hidden shadow-inner-soft">
      <!-- Progress fill -->
      <div 
        class="{heightClass} {barColor} rounded-full transition-all duration-700 ease-out relative overflow-hidden"
        class:animate-pulse={animated && !$reducedMotionStore && percentage > 0 && percentage < 100}
        style="width: {percentage}%"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax={max}
      >
        <!-- Shimmer effect -->
        {#if animated && !$reducedMotionStore && percentage > 0}
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        {/if}
      </div>
    </div>
    
    <!-- Milestone markers -->
    {#if showMilestones}
      <div class="absolute inset-0 flex items-center">
        {#each milestones as milestone}
          <div 
            class="absolute w-1 {heightClass} transition-colors duration-300 {percentage < milestone ? 'bg-base-content/20' : 'bg-white/50'}"
            style="left: {milestone}%"
          ></div>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Milestone labels -->
  {#if showMilestones}
    <div class="flex justify-between text-xs text-base-content/40 px-1">
      <span>Start</span>
      <span>25%</span>
      <span>50%</span>
      <span>75%</span>
      <span>Done!</span>
    </div>
  {/if}
</div>

<style>
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
</style>
