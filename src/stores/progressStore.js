// Progress & Achievement System for Gamification
import {
    XP_PER_STAR,
    XP_LEVEL_2,
    XP_LEVEL_3,
    MAX_STARS,
} from '../config.js';
import { createPersistentStore } from '../lib/persistentStore.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// All badge keys EXCEPT `completionist` (which is auto-awarded once every
// other badge is earned). Order is the display order in the menu.
export const BADGE_KEYS = [
    'firstAdventure',
    'perfectScore',
    'helpfulHero',
    'sequenceMaster',
    'questionMaster',
    'superNavigator',
    'explorerBadge',
    'weekWarrior',
];

export const STAR_KEYS = [
    'helpVisitorStars',
    'safeWalkStars',
    'shortQAStars',
    'tripPlannerStars',
    'learnPlacesStars',
];

const STREAK_FOR_WEEK_WARRIOR = 7;

const DEFAULT_PROFILE = {
    name: '',
    avatar: '🧒',
    characterName: 'Explorer',
    joinedAt: null,
    level: 1, // 1: Beginner, 2: Intermediate, 3: Advanced
    xp: 0,
};

const DEFAULT_STICKERS = {
    // Per-module star counters
    helpVisitorStars: 0,
    safeWalkStars: 0,
    shortQAStars: 0,
    tripPlannerStars: 0,
    learnPlacesStars: 0,

    // Achievement badges
    firstAdventure: false,
    perfectScore: false,
    helpfulHero: false,
    sequenceMaster: false,
    questionMaster: false,
    superNavigator: false,
    explorerBadge: false,
    weekWarrior: false,
    completionist: false,

    // Streak tracking
    dailyStreak: 0,
    bestStreak: 0,
    lastPlayDate: null,
};

const DEFAULT_PROGRESS = {
    helpVisitor: { totalCompleted: 0, bestScore: 0, hintsUsed: 0, perfectRounds: 0 },
    safeWalk:    { scenariosCompleted: 0, perfectSequences: 0, totalAttempts: 0 },
    shortQA:     { questionsAnswered: 0, correctAnswers: 0, streakBest: 0 },
    tripPlanner: { tripsPlanned: 0, uniqueDestinations: [], safetyTipsRead: 0 },
    learnPlaces: { placesViewed: [], quizzesTaken: 0, favoritePlace: null },
};

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------

export const studentProfile = createPersistentStore('studentProfile', DEFAULT_PROFILE);
export const stickersStore  = createPersistentStore('stickersEarned',  DEFAULT_STICKERS);
export const progressStore  = createPersistentStore('moduleProgress',  DEFAULT_PROGRESS);

// ---------------------------------------------------------------------------
// Award helpers
// ---------------------------------------------------------------------------

export function awardSticker(stickerKey) {
    let justAwarded = false;
    stickersStore.update(stickers => {
        if (!stickers[stickerKey]) {
            stickers[stickerKey] = true;
            justAwarded = true;
        }
        // Auto-award completionist if every other badge is earned.
        if (!stickers.completionist && BADGE_KEYS.every(k => stickers[k])) {
            stickers.completionist = true;
        }
        return stickers;
    });

    if (justAwarded && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sticker-earned', {
            detail: { sticker: stickerKey },
        }));
    }
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
                detail: { level: profile.level },
            }));
        }
        return profile;
    });
}

export function updateStreak() {
    let earnedWeekWarrior = false;
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

        if (!stickers.weekWarrior && stickers.dailyStreak >= STREAK_FOR_WEEK_WARRIOR) {
            earnedWeekWarrior = true;
        }
        return stickers;
    });

    if (earnedWeekWarrior) awardSticker('weekWarrior');
}

export function calculateOverallProgress(progress) {
    const weights = {
        helpVisitor: 25,
        safeWalk:    25,
        shortQA:     25,
        tripPlanner: 15,
        learnPlaces: 10,
    };

    let score = 0;
    score += Math.min(progress.helpVisitor.totalCompleted / 20, 1)        * weights.helpVisitor;
    score += Math.min(progress.safeWalk.scenariosCompleted / 10, 1)       * weights.safeWalk;
    score += Math.min(progress.shortQA.correctAnswers / 30, 1)            * weights.shortQA;
    score += Math.min(progress.tripPlanner.tripsPlanned / 5, 1)           * weights.tripPlanner;
    score += Math.min(progress.learnPlaces.placesViewed.length / 20, 1)   * weights.learnPlaces;

    return Math.round(score);
}

export function resetAllProgress() {
    studentProfile.set({ ...DEFAULT_PROFILE });
    stickersStore.set({ ...DEFAULT_STICKERS });
    progressStore.set(structuredClone(DEFAULT_PROGRESS));

    if (typeof localStorage !== 'undefined') {
        ['studentProfile', 'stickersEarned', 'moduleProgress'].forEach(k => {
            try { localStorage.removeItem(k); } catch { /* ignore */ }
        });
    }
}
