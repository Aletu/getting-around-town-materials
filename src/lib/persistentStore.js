import { writable } from 'svelte/store';

function readStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn(`[persistentStore] Could not persist "${key}":`, e);
    }
}

// Returns a writable Svelte store backed by localStorage. Falls back to a
// plain in-memory writable when localStorage is unavailable (SSR/tests).
export function createPersistentStore(key, startValue) {
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
