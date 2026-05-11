import { writable } from 'svelte/store';
import { SCENARIOS } from './data/scenarios.js';
import { SHORT_QA_ITEMS } from './data/shortQA.js';
import { SAFE_WALK_SCENARIOS } from './data/sequenceText.js';
import { createPersistentStore } from './lib/persistentStore.js';

export const teacherMode = writable(false);
export const scenariosStore = createPersistentStore('scenariosData', SCENARIOS);
export const shortQAStore = createPersistentStore('shortQAData', SHORT_QA_ITEMS);
export const safeWalkStore = createPersistentStore('safeWalkData', SAFE_WALK_SCENARIOS);

// Settings
export const themeStore = createPersistentStore('theme', 'gettingaround');
export const fontSizeStore = createPersistentStore('fontSize', 'normal'); // normal, large, xlarge
export const reducedMotionStore = createPersistentStore('reducedMotion', false);
export const dyslexiaFontStore = createPersistentStore('dyslexiaFont', false);

// Toast
function createToastStore() {
    const { subscribe, update } = writable([]);
    const timers = new Map();
    let nextToastId = Date.now();

    return {
        subscribe,
        add: (message, type = 'info', duration = 3000) => {
            const id = nextToastId++;
            update(toasts => [...toasts, { id, message, type }]);

            const timer = setTimeout(() => {
                timers.delete(id);
                update(toasts => toasts.filter(t => t.id !== id));
            }, duration);

            timers.set(id, timer);
        },
        remove: (id) => {
            const timer = timers.get(id);
            if (timer) {
                clearTimeout(timer);
                timers.delete(id);
            }
            update(toasts => toasts.filter(t => t.id !== id));
        }
    };
}

export const toastStore = createToastStore();
