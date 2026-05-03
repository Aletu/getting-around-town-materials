<script>
  import { profileListStore, activeProfileIdStore, studentProfile } from '../stores/progressStore.js';
  import { toastStore } from '../stores.js';
  import { fade, fly } from 'svelte/transition';

  export let isOpen = false;
  export let onClose = () => {};

  const AVATARS = ['🧒','👧','👦','🧑','👩','👨','🧒‍♀️','👦🏽','👧🏽','🧒🏾','👦🏿','👧🏿'];

  let newName = '';
  let newAvatar = AVATARS[0];
  let addingProfile = false;

  function selectProfile(id) {
    if ($activeProfileIdStore === id) return;

    // Persist current student data under active profile key before switching
    const currentData = JSON.parse(localStorage.getItem('studentProfile') || '{}');
    try { localStorage.setItem(`profile_${$activeProfileIdStore}`, JSON.stringify(currentData)); } catch { /* ignore */ }

    // Switch active profile
    activeProfileIdStore.set(id);

    // Load the new profile's data (or reset to defaults)
    try {
      const saved = localStorage.getItem(`profile_${id}`);
      if (saved) {
        studentProfile.set(JSON.parse(saved));
      } else {
        const profile = $profileListStore.find(p => p.id === id);
        studentProfile.set({ name: profile?.name || '', avatar: profile?.avatar || '🧒', characterName: 'Explorer', joinedAt: new Date().toISOString(), level: 1, xp: 0 });
      }
    } catch { /* use current */ }

    toastStore.add(`Switched to ${$profileListStore.find(p => p.id === id)?.name || 'profile'}`, 'success');
    onClose();
  }

  function addProfile() {
    const name = newName.trim();
    if (!name) { toastStore.add('Please enter a name', 'warning'); return; }
    if ($profileListStore.length >= 6) { toastStore.add('Maximum 6 profiles reached', 'warning'); return; }

    const id = `profile_${Date.now()}`;
    profileListStore.update(list => [...list, { id, name, avatar: newAvatar }]);
    newName = '';
    newAvatar = AVATARS[0];
    addingProfile = false;
    toastStore.add(`Profile "${name}" created!`, 'success');
  }

  function deleteProfile(id) {
    if ($profileListStore.length <= 1) { toastStore.add("Can't delete the only profile", 'warning'); return; }

    profileListStore.update(list => list.filter(p => p.id !== id));
    try { localStorage.removeItem(`profile_${id}`); } catch { /* ignore */ }

    // If active profile was deleted, switch to first remaining
    if ($activeProfileIdStore === id) {
      const remaining = $profileListStore[0];
      if (remaining) selectProfile(remaining.id);
    }
    toastStore.add('Profile deleted', 'info');
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" transition:fade={{ duration: 150 }}>
    <button
      class="absolute inset-0 bg-base-content/30 backdrop-blur-sm"
      aria-label="Close profile switcher"
      on:click={onClose}
    ></button>
    <div
      class="relative z-[1]"
      role="dialog"
      aria-modal="true"
      aria-label="Profile Switcher"
    >
    <div
      class="bg-base-100 rounded-2xl shadow-xl w-full max-w-sm border border-base-200"
      transition:fly={{ y: 20, duration: 250 }}
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-5 border-b border-base-200">
        <div class="flex items-center gap-3">
          <span class="text-2xl">👥</span>
          <div>
            <h2 class="font-bold text-base-content">Switch Profile</h2>
            <p class="text-xs text-base-content/50">Up to 6 student profiles</p>
          </div>
        </div>
        <button class="btn btn-ghost btn-circle btn-sm" on:click={onClose} aria-label="Close">✕</button>
      </div>

      <div class="p-4 space-y-2">
        {#each $profileListStore as profile}
          <div
            class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer
              {$activeProfileIdStore === profile.id
                ? 'border-primary bg-primary/5'
                : 'border-base-200 hover:border-base-300 hover:bg-base-200/50'}"
            on:click={() => selectProfile(profile.id)}
            on:keydown={e => e.key === 'Enter' && selectProfile(profile.id)}
            role="button"
            tabindex="0"
            aria-pressed={$activeProfileIdStore === profile.id}
          >
            <span class="text-3xl">{profile.avatar}</span>
            <span class="flex-1 font-semibold text-base-content truncate">{profile.name}</span>
            {#if $activeProfileIdStore === profile.id}
              <span class="badge badge-primary badge-sm">Active</span>
            {:else}
              <button
                class="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-lg"
                on:click|stopPropagation={() => deleteProfile(profile.id)}
                aria-label="Delete profile {profile.name}"
              >✕</button>
            {/if}
          </div>
        {/each}

        <!-- Add new profile -->
        {#if addingProfile}
          <div class="bg-base-200/60 rounded-xl p-4 space-y-3 border border-base-200" transition:fly={{ y: 8, duration: 200 }}>
            <input
              type="text"
              class="input input-bordered input-sm w-full"
              placeholder="Student name"
              maxlength="30"
              bind:value={newName}
              on:keydown={e => e.key === 'Enter' && addProfile()}
              aria-label="New profile name"
            />
            <div class="flex flex-wrap gap-1.5">
              {#each AVATARS as av}
                <button
                  class="text-xl p-1 rounded-lg transition-all {newAvatar === av ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'hover:bg-base-300'}"
                  on:click={() => (newAvatar = av)}
                  aria-label="Select avatar {av}"
                >{av}</button>
              {/each}
            </div>
            <div class="flex gap-2">
              <button class="btn btn-ghost btn-sm flex-1 rounded-lg" on:click={() => (addingProfile = false)}>Cancel</button>
              <button class="btn btn-primary btn-sm flex-1 rounded-lg" on:click={addProfile}>Create</button>
            </div>
          </div>
        {:else if $profileListStore.length < 6}
          <button
            class="btn btn-ghost w-full rounded-xl border-2 border-dashed border-base-300 hover:border-primary hover:bg-primary/5 gap-2 text-base-content/60 hover:text-primary transition-all"
            on:click={() => (addingProfile = true)}
          >
            <span class="text-lg">+</span> Add Profile
          </button>
        {/if}
      </div>
    </div>
    </div>
  </div>
{/if}
