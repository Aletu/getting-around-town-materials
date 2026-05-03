import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import PlanTrip from './PlanTrip.svelte';
import { teacherMode } from '../stores.js';

describe('PlanTrip Component', () => {
    beforeEach(() => {
        teacherMode.set(false);
    });

    it('renders the destination selection step on load', async () => {
        render(PlanTrip);
        expect(await screen.findByRole('heading', { name: /Where do you want to go today\?/i })).toBeInTheDocument();
    });

    it('shows a list of destination cards', async () => {
        render(PlanTrip);
        const placeNames = ['Park', 'Library', 'School', 'Hospital', 'Bakery'];
        const foundButtons = placeNames
            .map((name) => screen.queryByRole('button', { name: new RegExp(name, 'i') }))
            .filter(Boolean);
        expect(foundButtons.length).toBeGreaterThan(0);
    });

    it('disallows advancing without selecting a destination', async () => {
        render(PlanTrip);
        const nextBtn = screen.getByRole('button', { name: /Next/i });
        await fireEvent.click(nextBtn);

        expect(screen.getByRole('heading', { name: /Where do you want to go today\?/i })).toBeInTheDocument();
    });

    it('advances to packing step after selecting a destination', async () => {
        render(PlanTrip);
        await fireEvent.click(screen.getByRole('button', { name: /Bakery/i }));
        await fireEvent.click(screen.getByRole('button', { name: /Next/i }));

        expect(await screen.findByRole('heading', { name: /What do you need to bring\?/i })).toBeInTheDocument();
    });

    it('renders without crashing (smoke test)', () => {
        expect(() => render(PlanTrip)).not.toThrow();
    });
});
