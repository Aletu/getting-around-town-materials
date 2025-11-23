import { writable } from 'svelte/store';

// Global flag toggled from the top navbar in `App.svelte`.
export const teacherMode = writable(false);

