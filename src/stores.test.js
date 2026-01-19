import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { toastStore, themeStore } from './stores';

describe('stores', () => {
    describe('toastStore', () => {
        beforeEach(() => {
            // clear store
            // Since we can't easily clear the closures, we rely on the specific test
            // or we could assume it starts empty or we can add a method to clear it in the implementation if needed
            // But for now, we just check if addition works
        });

        it('should add a toast and remove it after duration', () => {
            vi.useFakeTimers();
            const message = 'Test Message';
            
            toastStore.add(message, 'info', 1000);
            
            let toasts = get(toastStore);
            expect(toasts.length).toBeGreaterThan(0);
            expect(toasts[0].message).toBe(message);

            vi.advanceTimersByTime(1000);
            
            toasts = get(toastStore);
            expect(toasts.length).toBe(0);
            vi.useRealTimers();
        });

        it('should remove a toast manually', () => {
            toastStore.add('To Remove');
            let toasts = get(toastStore);
            const id = toasts[0].id;
            
            expect(toasts.length).toBe(1);
            
            toastStore.remove(id);
            toasts = get(toastStore);
            expect(toasts.length).toBe(0);
        });
    });

    describe('persistent store (themeStore)', () => {
        beforeEach(() => {
            localStorage.clear();
        });

        it('should initialize with default value', () => {
            // Note: tests run in JSDOM, so localStorage exists
            // But the store might have already initialized on module import.
            // This makes testing singletons tricky without a reset mechanism.
            // simpler check: it has a value.
            const val = get(themeStore);
            expect(val).toBe('gettingaround'); 
        });

        it('should update localStorage when store changes', () => {
            themeStore.set('dark');
            expect(localStorage.getItem('theme')).toBe('"dark"');
        });
    });
});
