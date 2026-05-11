import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { focusTrap } from './focusTrap.js';

describe('focusTrap', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
    });

    function flushMicrotasks() {
        return new Promise(resolve => queueMicrotask(() => resolve(undefined)));
    }

    it('autofocuses the first focusable element on mount', async () => {
        container.innerHTML = `
            <button id="first">First</button>
            <button id="second">Second</button>
        `;
        focusTrap(container);
        await flushMicrotasks();
        expect(document.activeElement?.id).toBe('first');
    });

    it('falls back to focusing the node itself when no focusable children exist', async () => {
        container.innerHTML = '<p>No focusable elements here.</p>';
        focusTrap(container);
        await flushMicrotasks();
        expect(document.activeElement).toBe(container);
        expect(container.getAttribute('tabindex')).toBe('-1');
    });

    it('cycles focus from the last element back to the first on Tab', async () => {
        container.innerHTML = `
            <button id="first">First</button>
            <button id="second">Second</button>
        `;
        focusTrap(container);
        await flushMicrotasks();

        const second = /** @type {HTMLElement} */ (container.querySelector('#second'));
        second.focus();
        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        container.dispatchEvent(event);
        expect(document.activeElement?.id).toBe('first');
    });

    it('cycles focus from the first element to the last on Shift+Tab', async () => {
        container.innerHTML = `
            <button id="first">First</button>
            <button id="second">Second</button>
        `;
        focusTrap(container);
        await flushMicrotasks();

        const first = /** @type {HTMLElement} */ (container.querySelector('#first'));
        first.focus();
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
        container.dispatchEvent(event);
        expect(document.activeElement?.id).toBe('second');
    });

    it('restores focus to the previously-focused element on destroy', async () => {
        const trigger = document.createElement('button');
        trigger.id = 'trigger';
        document.body.appendChild(trigger);
        trigger.focus();

        container.innerHTML = '<button id="modal-button">In modal</button>';
        const action = focusTrap(container);
        await flushMicrotasks();

        action.destroy();
        expect(document.activeElement?.id).toBe('trigger');
        trigger.remove();
    });
});
