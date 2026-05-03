// Progress & Achievement System for Gamification
import { writable } from 'svelte/store';
import {
    XP_PER_STAR,
    XP_LEVEL_2,
    XP_LEVEL_3,
    MAX_STARS,
} from '../config.js';

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

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
        console.warn(`[progressStore] Could not persist "${key}" to localStorage:`, e);
    }
}

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

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------

// Student Profile & Character
export const studentProfile = createPersistentStore('studentProfile', {
    name: '',
    avatar: '🧒',
    characterName: 'Explorer',
    joinedAt: null,
    level: 1, // 1: Principiante, 2: Intermedio, 3: Avanzado
    xp: 0
});

// Achievement Sticker Book
export const stickersStore = createPersistentStore('stickersEarned', {
    // Module completion stickers
    helpVisitorStars: 0,
    safeWalkStars: 0,
    shortQAStars: 0,
    tripPlannerStars: 0,
    learnPlacesStars: 0,

    // Special achievement stickers
    firstAdventure: false,
    perfectScore: false,
    explorerBadge: false,
    safetyChampion: false,
    helpfulHero: false,
    superNavigator: false,
    questionMaster: false,
    completionist: false,

    // Streak tracking
    dailyStreak: 0,
    bestStreak: 0,
    lastPlayDate: null
});

// Progress tracking per module
export const progressStore = createPersistentStore('moduleProgress', {
    helpVisitor: {
        totalCompleted: 0,
        bestScore: 0,
        hintsUsed: 0,
        perfectRounds: 0
    },
    safeWalk: {
        scenariosCompleted: 0,
        perfectSequences: 0,
        totalAttempts: 0
    },
    shortQA: {
        questionsAnswered: 0,
        correctAnswers: 0,
        streakBest: 0
    },
    tripPlanner: {
        tripsPlanned: 0,
        uniqueDestinations: [],
        safetyTipsRead: 0
    },
    learnPlaces: {
        placesViewed: [],
        quizzesTaken: 0,
        favoritePlace: null
    }
});

// ---------------------------------------------------------------------------
// Multiple student profiles
// ---------------------------------------------------------------------------

const DEFAULT_PROFILES = [
    { id: 'default', name: 'Student 1', avatar: '🧒' }
];

export const profileListStore = createPersistentStore('profileList', DEFAULT_PROFILES);
export const activeProfileIdStore = createPersistentStore('activeProfileId', 'default');

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function awardSticker(stickerKey) {
    stickersStore.update(stickers => {
        if (!stickers[stickerKey]) {
            stickers[stickerKey] = true;
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('sticker-earned', {
                    detail: { sticker: stickerKey }
                }));
            }
        }
        return stickers;
    });
}

export function addStars(moduleKey, stars) {
    stickersStore.update(stickers => {
        const key = `${moduleKey}Stars`;
        if (stickers[key] !== undefined) {
            stickers[key] = Math.min(stickers[key] + stars, MAX_STARS);
        }
        return stickers;
    });

    studentProfile.update(profile => {
        profile.xp = (profile.xp || 0) + (stars * XP_PER_STAR);
        const oldLevel = profile.level || 1;

        if (profile.xp >= XP_LEVEL_2 && oldLevel === 1) {
            profile.level = 2;
        } else if (profile.xp >= XP_LEVEL_3 && oldLevel === 2) {
            profile.level = 3;
        }

        if (profile.level > oldLevel && typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('level-up', {
                detail: { level: profile.level }
            }));
        }
        return profile;
    });
}

export function updateStreak() {
    stickersStore.update(stickers => {
        const today = new Date().toDateString();
        if (stickers.lastPlayDate === today) return stickers;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (stickers.lastPlayDate === yesterday.toDateString()) {
            stickers.dailyStreak += 1;
            stickers.bestStreak = Math.max(stickers.bestStreak, stickers.dailyStreak);
        } else {
            stickers.dailyStreak = 1;
        }

        stickers.lastPlayDate = today;
        return stickers;
    });
}

export function calculateOverallProgress(progress) {
    const weights = {
        helpVisitor: 25,
        safeWalk: 25,
        shortQA: 25,
        tripPlanner: 15,
        learnPlaces: 10
    };

    let score = 0;
    score += Math.min(progress.helpVisitor.totalCompleted / 20, 1) * weights.helpVisitor;
    score += Math.min(progress.safeWalk.scenariosCompleted / 10, 1) * weights.safeWalk;
    score += Math.min(progress.shortQA.correctAnswers / 30, 1) * weights.shortQA;
    score += Math.min(progress.tripPlanner.tripsPlanned / 5, 1) * weights.tripPlanner;
    score += Math.min(progress.learnPlaces.placesViewed.length / 20, 1) * weights.learnPlaces;

    return Math.round(score);
}

export function resetAllProgress() {
    studentProfile.set({
        name: '',
        avatar: '🧒',
        characterName: 'Explorer',
        joinedAt: null,
        level: 1,
        xp: 0
    });

    stickersStore.set({
        helpVisitorStars: 0,
        safeWalkStars: 0,
        shortQAStars: 0,
        tripPlannerStars: 0,
        learnPlacesStars: 0,
        firstAdventure: false,
        perfectScore: false,
        explorerBadge: false,
        safetyChampion: false,
        helpfulHero: false,
        superNavigator: false,
        questionMaster: false,
        completionist: false,
        dailyStreak: 0,
        bestStreak: 0,
        lastPlayDate: null
    });

    progressStore.set({
        helpVisitor: { totalCompleted: 0, bestScore: 0, hintsUsed: 0, perfectRounds: 0 },
        safeWalk: { scenariosCompleted: 0, perfectSequences: 0, totalAttempts: 0 },
        shortQA: { questionsAnswered: 0, correctAnswers: 0, streakBest: 0 },
        tripPlanner: { tripsPlanned: 0, uniqueDestinations: [], safetyTipsRead: 0 },
        learnPlaces: { placesViewed: [], quizzesTaken: 0, favoritePlace: null }
    });

    if (typeof localStorage !== 'undefined') {
        ['studentProfile', 'stickersEarned', 'moduleProgress'].forEach(k => {
            try { localStorage.removeItem(k); } catch { /* ignore */ }
        });
    }
}
