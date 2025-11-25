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
