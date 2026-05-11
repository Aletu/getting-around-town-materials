import { describe, it, expect } from 'vitest';
import { shuffle } from './shuffle.js';

describe('shuffle', () => {
    it('returns a new array, not a mutation', () => {
        const input = [1, 2, 3, 4, 5];
        const out = shuffle(input);
        expect(out).not.toBe(input);
        expect(input).toEqual([1, 2, 3, 4, 5]);
    });

    it('preserves length and elements (no loss, no duplicates)', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const out = shuffle(input);
        expect(out).toHaveLength(input.length);
        expect([...out].sort((a, b) => a - b)).toEqual(input);
    });

    it('handles empty and single-element arrays', () => {
        expect(shuffle([])).toEqual([]);
        expect(shuffle([42])).toEqual([42]);
    });

    it('produces different orderings (not strictly identity)', () => {
        // Probabilistically should not always return identical order across many runs.
        const input = Array.from({ length: 20 }, (_, i) => i);
        let identicalCount = 0;
        for (let i = 0; i < 50; i++) {
            const out = shuffle(input);
            if (out.every((v, idx) => v === input[idx])) identicalCount++;
        }
        expect(identicalCount).toBeLessThan(50);
    });
});
