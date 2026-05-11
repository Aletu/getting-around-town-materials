// Svelte action: trap focus inside the node, autofocus the first focusable
// element on mount, and restore focus to the previously-focused element
// when the node is destroyed. Use on a dialog/modal root.
//
//   <div role="dialog" aria-modal="true" use:focusTrap>...</div>

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
].join(',');

function isVisible(el) {
    // Best-effort visibility check that also works in jsdom (no layout).
    // We only treat an element as hidden if it's explicitly hidden via CSS.
    if (el.hasAttribute('hidden')) return false;
    if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return true;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
}

function getFocusable(node) {
    return Array.from(node.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter(el => !el.hasAttribute('disabled') && isVisible(el));
}

export function focusTrap(node) {
    const previouslyFocused = /** @type {HTMLElement | null} */ (document.activeElement);

    function handleKeydown(event) {
        if (event.key !== 'Tab') return;
        const focusable = getFocusable(node);
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey) {
            if (active === first || !node.contains(active)) {
                event.preventDefault();
                last.focus();
            }
        } else if (active === last) {
            event.preventDefault();
            first.focus();
        }
    }

    // Autofocus first focusable element after the node is in the DOM.
    queueMicrotask(() => {
        const focusable = getFocusable(node);
        if (focusable.length > 0) {
            focusable[0].focus();
        } else {
            // Make the dialog itself focusable so screen readers announce it.
            if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '-1');
            node.focus();
        }
    });

    node.addEventListener('keydown', handleKeydown);

    return {
        destroy() {
            node.removeEventListener('keydown', handleKeydown);
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
        },
    };
}
