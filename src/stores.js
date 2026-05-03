import { writable } from 'svelte/store';
import { SCENARIOS } from './data/scenarios.js';
import { SHORT_QA_ITEMS } from './data/shortQA.js';
import { SAFE_WALK_SCENARIOS } from './data/sequenceText.js';

// Helper to read from localStorage safely
function readStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        // Corrupted data or access denied — start fresh
        return fallback;
    }
}

// Helper to write to localStorage safely
function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        // QuotaExceededError or SecurityError — log and move on
        console.warn(`[stores] Could not persist "${key}" to localStorage:`, e);
    }
}

// Creates a writable store backed by localStorage
function createPersistentStore(key, startValue) {
    if (typeof localStorage === 'undefined') {
        return writable(startValue);
    }

    const initial = readStorage(key, startValue);
    const store = writable(initial);

    let isFirst = true;
    store.subscribe(value => {
        if (isFirst) { isFirst = false; return; }
        writeStorage(key, value);
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
