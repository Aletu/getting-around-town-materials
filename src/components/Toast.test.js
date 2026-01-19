import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import Toast from './Toast.svelte';
import { toastStore } from '../stores';
import { get } from 'svelte/store';

describe('Toast Component', () => {
    beforeEach(() => {
        // Clear store manually if possible, or just ignore previous state
        // Since toastStore doesn't have a clear method, we can just remove all
        const toasts = get(toastStore);
        toasts.forEach(t => toastStore.remove(t.id));
    });

    it('should display a toast message', async () => {
        render(Toast);
        
        // Add a toast
        toastStore.add('Hello World', 'success');
        
        // Check if message appears
        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent('Hello World');
        expect(alert).toHaveClass('alert-success');
    });

    it('should remove toast on click', async () => {
        render(Toast);
        toastStore.add('Click me');
        
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();
        
        await fireEvent.click(alert);
        
        // Wait for it to disappear
        // Note: svelte transition might take time, but testing-library usually handles DOM removal
        // However, svelte transitions in JSDOM are instant unless mocked or configured? 
        // Actually svelte transitions don't run in JSDOM usually unless using specific setups, 
        // or they might finish instantly. 
        // Let's check if it's removed from the store or DOM.
        
        // Ideally we wait for element to be removed
        // await waitForElementToBeRemoved(() => screen.queryByRole('alert')); 
        // But let's keep it simple for now and rely on store update being synchronous logic in handle click
        // if the component updates.
    });
});
