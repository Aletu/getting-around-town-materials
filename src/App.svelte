<script>
  // Lightweight shell components loaded eagerly (used on every page)
  import TeacherPanel from "./components/TeacherPanel.svelte";
  import Toast from "./components/Toast.svelte";
  import Celebration from "./components/Celebration.svelte";
  import Icon from "./components/Icon.svelte";
  // AchievementsModal is statically imported (small, lazy-loading it produced
  // a perceptible delay between clicking Profile and the modal fading in,
  // which read as a backdrop flicker).
  import AchievementsModal from "./components/AchievementsModal.svelte";
  import ucrLogo from "./assets/firma-ucr-vertical.svg";
  import {
    teacherMode,
    themeStore,
    fontSizeStore,
    reducedMotionStore,
    dyslexiaFontStore,
  } from "./stores.js";
  import { updateStreak } from "./stores/progressStore.js";
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";

  let view = "home";
  let showSettings = false;
  let showAchievements = false;
  let showCelebration = false;
  let celebrationType = "success";
  let celebrationMessage = "";

  // Update streak on load
  onMount(() => {
    updateStreak();

    // Listen for sticker earned events
    window.addEventListener("sticker-earned", handleStickerEarned);
    return () =>
      window.removeEventListener("sticker-earned", handleStickerEarned);
  });

  function handleStickerEarned(event) {
    celebrationType = "badge";
    celebrationMessage = "New Badge Earned!";
    showCelebration = true;
  }

  function setView(id) {
    view = id;
    // Match "auto" so the user lands at the top immediately when changing views.
    // The previous double-scroll (smooth then forced auto) was a workaround for
    // a transition timing bug that no longer reproduces.
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  // Apply settings — split per-store so each only fires when its own value changes
  $: if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", $themeStore);
  }

  $: if (typeof document !== "undefined") {
    const html = document.documentElement;
    html.classList.toggle("text-scale-large", $fontSizeStore === "large");
    html.classList.toggle("text-scale-xlarge", $fontSizeStore === "xlarge");
  }

  $: if (typeof document !== "undefined") {
    document.body.classList.toggle("font-dyslexic", $dyslexiaFontStore);
  }

  $: if (typeof document !== "undefined") {
    document.body.classList.toggle("motion-reduce", $reducedMotionStore);
  }
</script>

<div class="min-h-screen flex flex-col bg-base-200 font-sans overflow-x-hidden">
  <!-- Skip to main content link for keyboard users -->
  <a href="#main-content" class="skip-link"> Skip to main content </a>
  <header
    class="navbar bg-base-100/95 backdrop-blur-md px-4 lg:px-8 shadow-soft sticky top-0 z-50 border-b border-base-200/50"
  >
    <div class="flex-1 flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div
          class="w-11 h-11 bg-primary text-primary-content rounded-2xl flex items-center justify-center shadow-md -rotate-3 ring-2 ring-base-100 ring-offset-2 ring-offset-base-200"
        >
          <span class="text-xl">🏘️</span>
        </div>
        <div class="hidden xs:block">
          <span
            class="font-display font-black text-lg sm:text-2xl text-base-content tracking-tight leading-none block"
            >Getting Around Town</span
          >
          <span
            class="text-[0.7rem] text-primary font-bold uppercase tracking-[0.18em] hidden sm:block"
            >Explore · Practice · Belong</span
          >
        </div>
      </div>
      <nav class="hidden md:flex gap-1 ml-6" aria-label="Main navigation">
        <button
          class="btn btn-sm rounded-lg px-5 font-semibold transition-all duration-200"
          class:btn-primary={view !== "learn"}
          class:shadow-md={view !== "learn"}
          class:btn-ghost={view === "learn"}
          on:click={() => setView("home")}
        >
          <Icon name="grid" class="h-4 w-4 mr-1" />
          Activities
        </button>
        <button
          class="btn btn-sm rounded-lg px-5 font-semibold transition-all duration-200"
          class:btn-primary={view === "learn"}
          class:shadow-md={view === "learn"}
          class:btn-ghost={view !== "learn"}
          on:click={() => setView("learn")}
        >
          <Icon name="book" class="h-4 w-4 mr-1" />
          Learn Places
        </button>
      </nav>
    </div>
    <div class="flex-none flex items-center gap-2">
      <button
        class="btn btn-ghost btn-sm rounded-lg px-3 font-semibold hover:bg-base-200 transition-colors"
        on:click={() => (showAchievements = true)}
        aria-label="Open My Profile"
      >
        Profile
      </button>
      <button
        class="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
        on:click={() => (showSettings = true)}
        aria-label="Open Settings"
      >
        <Icon name="settings" />
      </button>
      <!-- Desktop View - Teacher Mode Toggle -->
      <div class="hidden sm:block">
        <label
          class="label cursor-pointer gap-2 bg-base-200/70 hover:bg-base-200 px-4 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-base-300"
        >
          <span
            class="label-text font-semibold text-xs uppercase tracking-wider text-base-content/60"
            >Teacher</span
          >
          <input
            type="checkbox"
            class="toggle toggle-primary toggle-sm"
            bind:checked={$teacherMode}
            aria-label="Toggle Teacher Mode"
          />
        </label>
      </div>

      <!-- Mobile View (Hamburger) -->
      <div class="dropdown dropdown-end md:hidden">
        <button
          type="button"
          class="btn btn-ghost btn-circle"
          aria-label="Open Menu"
          aria-haspopup="menu"
        >
          <Icon name="menu" />
        </button>
        <ul
          class="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg bg-base-100 rounded-xl w-56 border border-base-200 space-y-1"
          role="menu"
        >
          <li class="sm:hidden">
            <button
              class="rounded-lg font-medium"
              class:active={view !== "learn"}
              on:click={() => setView("home")}
            >
              <Icon name="grid" class="h-4 w-4" />
              Activities
            </button>
          </li>
          <li class="sm:hidden">
            <button
              class="rounded-lg font-medium"
              class:active={view === "learn"}
              on:click={() => setView("learn")}
            >
              <Icon name="book" class="h-4 w-4" />
              Learn Places
            </button>
          </li>
          <li class="sm:hidden"><div class="divider my-1"></div></li>
          <li>
            <label
              class="label cursor-pointer justify-between active:bg-base-200 rounded-lg"
            >
              <span class="label-text font-medium">Teacher Mode</span>
              <input
                type="checkbox"
                class="toggle toggle-primary toggle-sm"
                bind:checked={$teacherMode}
              />
            </label>
          </li>
        </ul>
      </div>
    </div>
  </header>

  <div
    id="main-content"
    class="flex-1 grid grid-cols-1 grid-rows-1 relative"
    class:pb-28={$teacherMode}
    tabindex="-1"
  >
    {#if view === "home"}
      <div
        class="flex-1 flex flex-col col-start-1 row-start-1 w-full"
        in:fade={{ duration: 250 }}
        out:fade={{ duration: 150 }}
      >
        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <section class="space-y-8 sm:space-y-12 lg:space-y-16">
            <!-- Hero Section -->
            <div
              class="hero relative rounded-[1.75rem] lg:rounded-[2.5rem] shadow-soft-lg border border-base-300/50 isolate overflow-hidden animate-fade-slide-up bg-base-100"
            >
              <!-- Warm wash + dotted texture -->
              <div class="absolute inset-0 -z-10">
                <div
                  class="absolute inset-0 bg-gradient-to-br from-accent/15 via-base-100 to-primary/10"
                ></div>
                <div
                  class="absolute inset-0 decoration-dots text-base-content/[0.06]"
                ></div>
                <!-- Decorative dashed route line -->
                <svg
                  class="absolute -right-10 -top-8 w-72 h-72 text-primary/15 hidden sm:block"
                  viewBox="0 0 200 200"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M20 170 C 60 120, 40 80, 90 70 S 160 90, 170 30"
                    stroke="currentColor"
                    stroke-width="6"
                    stroke-linecap="round"
                    stroke-dasharray="2 16"
                  />
                </svg>
              </div>

              <div
                class="hero-content flex-col lg:flex-row-reverse p-6 sm:p-10 lg:p-16 gap-6 sm:gap-8 lg:gap-16 relative z-10"
              >
                <div class="relative shrink-0">
                  <div
                    class="text-6xl sm:text-8xl lg:text-9xl animate-float select-none filter drop-shadow-xl"
                  >
                    🗺️
                  </div>
                  <span
                    class="absolute -top-2 -left-3 text-3xl sm:text-4xl animate-float select-none"
                    style="animation-delay:-2s"
                    aria-hidden="true">📍</span
                  >
                  <span
                    class="absolute bottom-2 -right-2 text-2xl sm:text-3xl animate-float select-none"
                    style="animation-delay:-4s"
                    aria-hidden="true">🚶</span
                  >
                  <div
                    class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-3 bg-base-content/10 rounded-full blur-md"
                  ></div>
                </div>
                <div class="text-center lg:text-left max-w-xl">
                  <span
                    class="inline-flex items-center gap-2 rounded-full bg-base-100/80 border border-base-300/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-sm mb-4 sm:mb-5"
                  >
                    🧭 Learn your way around
                  </span>
                  <h1
                    class="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-black mb-3 sm:mb-4 lg:mb-5 leading-[1.04]"
                  >
                    <span class="text-base-content">Find your way</span><br />
                    <span class="relative inline-block text-primary">
                      around town
                      <svg
                        class="absolute -bottom-2 left-0 w-full text-accent"
                        viewBox="0 0 220 16"
                        fill="none"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 11 C 60 4, 150 4, 217 9"
                          stroke="currentColor"
                          stroke-width="5"
                          stroke-linecap="round"
                        />
                      </svg>
                    </span>
                  </h1>
                  <p
                    class="text-base sm:text-lg lg:text-xl text-base-content/70 max-w-lg leading-relaxed mb-6 lg:mb-8"
                  >
                    Practice giving directions, helping visitors, and staying
                    safe on the street — through short, friendly activities.
                    Pick one below to begin.
                  </p>
                  <button
                    class="btn btn-primary btn-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-none gap-2 font-bold"
                    on:click={() => setView("learn")}
                  >
                    Start Learning
                    <Icon name="arrowRight" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Section Header -->
            <div
              class="flex items-center gap-4 animate-fade-slide-up"
              style="animation-delay: 100ms"
            >
              <div
                class="h-11 w-1.5 bg-gradient-to-b from-primary to-accent rounded-full"
              ></div>
              <div>
                <h2
                  class="font-display text-2xl sm:text-3xl font-extrabold text-base-content"
                >
                  Pick an activity
                </h2>
                <p class="text-sm text-base-content/60 mt-1">
                  Four playful ways to practice getting around
                </p>
              </div>
            </div>

            <!-- Activity Cards Grid -->
            <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
              <!-- Help Visitor Card -->
              <article
                class="group relative flex flex-col rounded-3xl bg-base-100 border border-base-300/60 shadow-soft hover-lift overflow-hidden animate-fade-slide-up"
                style="animation-delay: 150ms"
              >
                <div class="relative h-24 bg-primary/10 rounded-t-3xl">
                  <div
                    class="absolute inset-0 decoration-dots text-primary/20 rounded-t-3xl overflow-hidden"
                  ></div>
                  <span
                    class="absolute -right-3 -top-4 text-7xl opacity-20 select-none pointer-events-none"
                    >💬</span
                  >
                  <div
                    class="absolute -bottom-6 left-5 w-16 h-16 rounded-2xl bg-base-100 ring-1 ring-base-300/60 shadow-md flex items-center justify-center text-3xl -rotate-3 group-hover:rotate-3 group-hover:scale-105 transition-transform duration-300"
                  >
                    💬
                  </div>
                </div>
                <div class="flex flex-col flex-1 p-5 pt-9">
                  <h3 class="font-display text-xl font-bold mb-1.5">
                    Help the Visitor
                  </h3>
                  <p class="text-sm text-base-content/60 leading-relaxed">
                    Read scenarios and guide visitors to the right place in town.
                  </p>
                  <div class="flex flex-wrap gap-1.5 my-4">
                    <span
                      class="badge badge-sm bg-primary/10 text-primary border-none font-semibold"
                      >10 Scenarios</span
                    >
                    <span
                      class="badge badge-sm bg-primary/10 text-primary border-none font-semibold"
                      >Scoring</span
                    >
                  </div>
                  <button
                    class="btn btn-primary mt-auto w-full rounded-xl shadow-sm group-hover:shadow-md transition-all font-semibold gap-2 group-hover:gap-3"
                    on:click={() => setView("help-visitor")}
                  >
                    Play Now
                    <Icon name="arrowRight" class="h-4 w-4" />
                  </button>
                </div>
              </article>

              <!-- Daily Sequences Card -->
              <article
                class="group relative flex flex-col rounded-3xl bg-base-100 border border-base-300/60 shadow-soft hover-lift overflow-hidden animate-fade-slide-up"
                style="animation-delay: 225ms"
              >
                <div class="relative h-24 bg-secondary/10 rounded-t-3xl">
                  <div
                    class="absolute inset-0 decoration-dots text-secondary/20 rounded-t-3xl overflow-hidden"
                  ></div>
                  <span
                    class="absolute -right-3 -top-4 text-7xl opacity-20 select-none pointer-events-none"
                    >📋</span
                  >
                  <div
                    class="absolute -bottom-6 left-5 w-16 h-16 rounded-2xl bg-base-100 ring-1 ring-base-300/60 shadow-md flex items-center justify-center text-3xl rotate-3 group-hover:-rotate-3 group-hover:scale-105 transition-transform duration-300"
                  >
                    📋
                  </div>
                </div>
                <div class="flex flex-col flex-1 p-5 pt-9">
                  <h3 class="font-display text-xl font-bold mb-1.5">
                    Daily Sequences
                  </h3>
                  <p class="text-sm text-base-content/60 leading-relaxed">
                    Put the daily activities in the right order.
                  </p>
                  <div class="flex flex-wrap gap-1.5 my-4">
                    <span
                      class="badge badge-sm bg-secondary/10 text-secondary border-none font-semibold"
                      >Drag & Drop</span
                    >
                    <span
                      class="badge badge-sm bg-secondary/10 text-secondary border-none font-semibold"
                      >Sequencing</span
                    >
                  </div>
                  <button
                    class="btn btn-secondary mt-auto w-full rounded-xl shadow-sm group-hover:shadow-md transition-all font-semibold gap-2 group-hover:gap-3"
                    on:click={() => setView("safe-walk")}
                  >
                    Play Now
                    <Icon name="arrowRight" class="h-4 w-4" />
                  </button>
                </div>
              </article>

              <!-- Short Q&A Card -->
              <article
                class="group relative flex flex-col rounded-3xl bg-base-100 border border-base-300/60 shadow-soft hover-lift overflow-hidden animate-fade-slide-up"
                style="animation-delay: 300ms"
              >
                <div class="relative h-24 bg-accent/15 rounded-t-3xl">
                  <div
                    class="absolute inset-0 decoration-dots text-accent/25 rounded-t-3xl overflow-hidden"
                  ></div>
                  <span
                    class="absolute -right-3 -top-4 text-7xl opacity-25 select-none pointer-events-none"
                    >❓</span
                  >
                  <div
                    class="absolute -bottom-6 left-5 w-16 h-16 rounded-2xl bg-base-100 ring-1 ring-base-300/60 shadow-md flex items-center justify-center text-3xl -rotate-3 group-hover:rotate-3 group-hover:scale-105 transition-transform duration-300"
                  >
                    ❓
                  </div>
                </div>
                <div class="flex flex-col flex-1 p-5 pt-9">
                  <h3 class="font-display text-xl font-bold mb-1.5">
                    Short Q&A
                  </h3>
                  <p class="text-sm text-base-content/60 leading-relaxed">
                    Choose the best response for everyday questions.
                  </p>
                  <div class="flex flex-wrap gap-1.5 my-4">
                    <span
                      class="badge badge-sm bg-accent/20 text-accent-content border-none font-semibold"
                      >5 Questions</span
                    >
                    <span
                      class="badge badge-sm bg-accent/20 text-accent-content border-none font-semibold"
                      >Logic</span
                    >
                  </div>
                  <button
                    class="btn btn-accent mt-auto w-full rounded-xl shadow-sm group-hover:shadow-md transition-all font-semibold text-accent-content gap-2 group-hover:gap-3"
                    on:click={() => setView("short-qa")}
                  >
                    Play Now
                    <Icon name="arrowRight" class="h-4 w-4" />
                  </button>
                </div>
              </article>

              <!-- Map Quest Card -->
              <article
                class="group relative flex flex-col rounded-3xl bg-base-100 border border-base-300/60 shadow-soft hover-lift overflow-hidden animate-fade-slide-up"
                style="animation-delay: 375ms"
              >
                <div class="relative h-24 bg-success/10 rounded-t-3xl">
                  <div
                    class="absolute inset-0 decoration-dots text-success/20 rounded-t-3xl overflow-hidden"
                  ></div>
                  <span
                    class="absolute -right-3 -top-4 text-7xl opacity-20 select-none pointer-events-none"
                    >🗺️</span
                  >
                  <div
                    class="absolute -bottom-6 left-5 w-16 h-16 rounded-2xl bg-base-100 ring-1 ring-base-300/60 shadow-md flex items-center justify-center text-3xl rotate-3 group-hover:-rotate-3 group-hover:scale-105 transition-transform duration-300"
                  >
                    🗺️
                  </div>
                </div>
                <div class="flex flex-col flex-1 p-5 pt-9">
                  <h3 class="font-display text-xl font-bold mb-1.5">
                    Map Quest
                  </h3>
                  <p class="text-sm text-base-content/60 leading-relaxed">
                    Read the directions and find the right place on the town map.
                  </p>
                  <div class="flex flex-wrap gap-1.5 my-4">
                    <span
                      class="badge badge-sm bg-success/10 text-success border-none font-semibold"
                      >Map Reading</span
                    >
                    <span
                      class="badge badge-sm bg-success/10 text-success border-none font-semibold"
                      >Directions</span
                    >
                  </div>
                  <button
                    class="btn btn-success mt-auto w-full rounded-xl shadow-sm group-hover:shadow-md transition-all font-semibold text-success-content gap-2 group-hover:gap-3"
                    on:click={() => setView("map-quest")}
                  >
                    Start Quest
                    <Icon name="arrowRight" class="h-4 w-4" />
                  </button>
                </div>
              </article>
            </div>
          </section>
        </main>

        <footer class="mt-8 sm:mt-16 bg-neutral text-neutral-content">
          <div class="max-w-7xl mx-auto p-5 sm:p-8 lg:p-12">
            <div
              class="flex flex-col lg:flex-row items-center justify-between gap-8"
            >
              <div class="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={ucrLogo}
                  alt="University of Costa Rica"
                  loading="lazy"
                  decoding="async"
                  width="114"
                  height="99"
                  class="h-16 lg:h-20 w-auto brightness-0 invert opacity-80"
                />
                <div class="h-px w-16 sm:h-12 sm:w-px bg-white/20"></div>
                <div class="text-center sm:text-left">
                  <p class="font-display font-bold text-lg">TCU-501 Project: Getting around town!</p>
                  <p class="text-sm opacity-60">By Alejandro Solórzano</p>
                  <p class="text-sm opacity-60">Escuela de Lenguas Modernas</p>
                  <p class="text-sm opacity-60">Universidad de Costa Rica</p>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row gap-3 items-center">
                <a
                  href="https://lenguasmodernas.ucr.ac.cr/tcu-501/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline btn-sm text-neutral-content border-neutral-content/30 hover:bg-white hover:text-neutral hover:border-white gap-2 rounded-lg"
                >
                  <Icon name="externalLink" class="h-4 w-4" />
                  Visit TCU-501 Website
                </a>
              </div>
            </div>
            <div
              class="mt-8 pt-6 border-t border-white/10 text-center text-xs opacity-40"
            >
              <p>
                &copy; {new Date().getFullYear()} Getting Around Town. Universidad
                de Costa Rica. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    {:else if view === "help-visitor"}
      <main
        class="flex-1 p-4 max-w-6xl mx-auto w-full col-start-1 row-start-1"
        in:fly={{ y: 20, duration: 300, delay: 200 }}
        out:fade={{ duration: 200 }}
      >
        {#await import("./components/HelpVisitor.svelte")}
          <div class="flex justify-center p-12"><span class="loading loading-spinner loading-lg text-primary"></span></div>
        {:then { default: HelpVisitor }}
          <svelte:component this={HelpVisitor} on:back={() => setView("home")} />
        {/await}
      </main>
    {:else if view === "safe-walk"}
      <main
        class="flex-1 p-4 max-w-6xl mx-auto w-full col-start-1 row-start-1"
        in:fly={{ y: 20, duration: 300, delay: 200 }}
        out:fade={{ duration: 200 }}
      >
        {#await import("./components/SafeWalkSequence.svelte")}
          <div class="flex justify-center p-12"><span class="loading loading-spinner loading-lg text-secondary"></span></div>
        {:then { default: SafeWalkSequence }}
          <svelte:component this={SafeWalkSequence} on:back={() => setView("home")} />
        {/await}
      </main>
    {:else if view === "short-qa"}
      <main
        class="flex-1 p-4 max-w-6xl mx-auto w-full col-start-1 row-start-1"
        in:fly={{ y: 20, duration: 300, delay: 200 }}
        out:fade={{ duration: 200 }}
      >
        {#await import("./components/ShortQA.svelte")}
          <div class="flex justify-center p-12"><span class="loading loading-spinner loading-lg text-accent"></span></div>
        {:then { default: ShortQA }}
          <svelte:component this={ShortQA} on:back={() => setView("home")} />
        {/await}
      </main>
    {:else if view === "map-quest"}
      <main
        class="flex-1 p-4 max-w-6xl mx-auto w-full col-start-1 row-start-1"
        in:fly={{ y: 20, duration: 300, delay: 200 }}
        out:fade={{ duration: 200 }}
      >
        {#await import("./components/MapQuest.svelte")}
          <div class="flex justify-center p-12"><span class="loading loading-spinner loading-lg text-success"></span></div>
        {:then { default: MapQuest }}
          <svelte:component this={MapQuest} on:back={() => setView("home")} />
        {/await}
      </main>
    {:else if view === "learn"}
      <main
        class="flex-1 p-4 max-w-6xl mx-auto w-full col-start-1 row-start-1"
        in:fly={{ y: 20, duration: 300, delay: 200 }}
        out:fade={{ duration: 200 }}
      >
        {#await import("./components/LearnPlaces.svelte")}
          <div class="flex justify-center p-12"><span class="loading loading-spinner loading-lg text-primary"></span></div>
        {:then { default: LearnPlaces }}
          <svelte:component this={LearnPlaces} on:back={() => setView("home")} />
        {/await}
      </main>
    {/if}
  </div>
</div>

<TeacherPanel />

{#if showSettings}
  {#await import("./components/SettingsModal.svelte") then { default: SettingsModal }}
    <svelte:component this={SettingsModal} on:close={() => (showSettings = false)} />
  {/await}
{/if}

<AchievementsModal isOpen={showAchievements} onClose={() => (showAchievements = false)} />

<Celebration
  show={showCelebration}
  type={celebrationType}
  message={celebrationMessage}
  onComplete={() => (showCelebration = false)}
/>

<Toast />
