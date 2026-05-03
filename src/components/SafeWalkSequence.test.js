import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import SafeWalkSequence from './SafeWalkSequence.svelte';
import { safeWalkStore, teacherMode } from '../stores.js';

const SAMPLE_SCENARIOS = [
    {
        id: 1,
        text: 'Crossing the Street',
        sequence: [
            { id: 'a', label: 'Look left and right', emoji: '👀', correctIndex: 0, alt: 'Look left and right' },
            { id: 'b', label: 'Wait for the green light', emoji: '🚦', correctIndex: 1, alt: 'Wait for the green light' },
            { id: 'c', label: 'Walk across the crosswalk', emoji: '🚶', correctIndex: 2, alt: 'Walk across the crosswalk' },
        ],
    },
    {
        id: 2,
        text: 'Walking to School',
        sequence: [
            { id: 'a', label: 'Put on your backpack', emoji: '🎒', correctIndex: 0, alt: 'Put on your backpack' },
            { id: 'b', label: 'Walk on the sidewalk', emoji: '🛣️', correctIndex: 1, alt: 'Walk on the sidewalk' },
            { id: 'c', label: 'Arrive at school safely', emoji: '🏫', correctIndex: 2, alt: 'Arrive at school safely' },
        ],
    },
    {
        id: 3,
        text: 'Using the Bus',
        sequence: [
            { id: 'a', label: 'Wait at the bus stop', emoji: '🚌', correctIndex: 0, alt: 'Wait at the bus stop' },
            { id: 'b', label: 'Let others off first', emoji: '🚏', correctIndex: 1, alt: 'Let others off first' },
            { id: 'c', label: 'Find a seat and hold on', emoji: '💺', correctIndex: 2, alt: 'Find a seat and hold on' },
        ],
    },
];

describe('SafeWalkSequence Component', () => {
    beforeEach(() => {
        teacherMode.set(false);
        safeWalkStore.set(JSON.parse(JSON.stringify(SAMPLE_SCENARIOS)));
    });

    it('renders a scenario title', async () => {
        render(SafeWalkSequence);
        expect(
            await screen.findByText(/Crossing the Street|Walking to School|Using the Bus/i)
        ).toBeInTheDocument();
    });

    it('renders sequence items as interactive buttons', async () => {
        render(SafeWalkSequence);
        expect(
            await screen.findByText(/Look left and right|Put on your backpack|Wait at the bus stop/i)
        ).toBeInTheDocument();
        expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
    });

    it('selecting an item highlights it', async () => {
        render(SafeWalkSequence);
        const options = await screen.findAllByRole('option');
        await fireEvent.click(options[0]);
        expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('swapping two items does not crash', async () => {
        render(SafeWalkSequence);
        const options = await screen.findAllByRole('option');
        await fireEvent.click(options[0]);
        await fireEvent.click(options[1]);
        expect(screen.getAllByRole('option').length).toBeGreaterThanOrEqual(2);
    });

    it('shows Sequence Editor in teacher mode', async () => {
        teacherMode.set(true);
        render(SafeWalkSequence);
        expect(await screen.findByText(/Sequence Editor/i)).toBeInTheDocument();
    });
});
