import { writable } from 'svelte/store';
import { SCENARIOS } from './data/scenarios.js';
import { SHORT_QA_ITEMS } from './data/shortQA.js';
import { SAFE_WALK_SCENARIOS } from './data/sequenceText.js';

// Helper to load from localStorage or use default
function createPersistentStore(key, startValue) {
    // Check if we are in a browser environment
    if (typeof localStorage === 'undefined') {
        return writable(startValue);
    }

    const storedValue = localStorage.getItem(key);
    const initial = storedValue ? JSON.parse(storedValue) : startValue;
    const store = writable(initial);
    
    store.subscribe(value => {
        localStorage.setItem(key, JSON.stringify(value));
    });
    
    return store;
}

export const teacherMode = writable(false);
export const scenariosStore = createPersistentStore('scenariosData', SCENARIOS);
export const shortQAStore = createPersistentStore('shortQAData', SHORT_QA_ITEMS);
export const safeWalkStore = createPersistentStore('safeWalkData', SAFE_WALK_SCENARIOS);

// Settings Stores
export const themeStore = createPersistentStore('theme', 'gettingaround');
export const fontSizeStore = createPersistentStore('fontSize', 'normal'); // normal, large, xlarge
export const reducedMotionStore = createPersistentStore('reducedMotion', false);
export const dyslexiaFontStore = createPersistentStore('dyslexiaFont', false);

// Toast Store
function createToastStore() {
    const { subscribe, update } = writable([]);

    return {
        subscribe,
        add: (message, type = 'info', duration = 3000) => {
            const id = Date.now();
            update(toasts => [...toasts, { id, message, type }]);
            setTimeout(() => {
                update(toasts => toasts.filter(t => t.id !== id));
            }, duration);
        },
        remove: (id) => {
            update(toasts => toasts.filter(t => t.id !== id));
        }
    };
}

export const toastStore = createToastStore();

