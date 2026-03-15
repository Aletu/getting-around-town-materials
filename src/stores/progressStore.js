// Progress & Achievement System for Gamification
import { writable } from 'svelte/store';

// Helper to load from localStorage or use default
function createPersistentStore(key, startValue) {
    if (typeof localStorage === 'undefined') {
        return writable(startValue);
    }

    const storedValue = localStorage.getItem(key);
    const initial = storedValue ? JSON.parse(storedValue) : startValue;
    const store = writable(initial);
    
    let isFirst = true;
    store.subscribe(value => {
        if (isFirst) {
            isFirst = false;
            return;
        }
        localStorage.setItem(key, JSON.stringify(value));
    });
    
    return store;
}

// Student Profile & Character
export const studentProfile = createPersistentStore('studentProfile', {
    name: '',
    avatar: '🧒',
    characterName: 'Explorer',
    joinedAt: null
});

// Achievement Sticker Book - Kids love collecting!
export const stickersStore = createPersistentStore('stickersEarned', {
    // Module completion stickers
    helpVisitorStars: 0,      // 1-3 stars per completion
    safeWalkStars: 0,
    shortQAStars: 0,
    tripPlannerStars: 0,
    learnPlacesStars: 0,
    
    // Special achievement stickers
    firstAdventure: false,    // Complete any activity
    perfectScore: false,      // Get 100% on any quiz
    explorerBadge: false,     // Learn all places
    safetyChampion: false,    // Complete SafeWalk 3 times
    helpfulHero: false,       // Help 20 visitors
    superNavigator: false,    // Plan 5 trips
    questionMaster: false,    // Answer 30 Q&A correctly
    completionist: false,     // Earn all other stickers
    
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

// Narrative wrapper - "Community Detective" story
export const storyProgress = createPersistentStore('storyProgress', {
    chapter: 1,
    unlockedAreas: ['downtown'],
    currentMission: null,
    completedMissions: [],
    detectiveBadgeLevel: 'Junior' // Junior -> Detective -> Super Detective
});

// Helper functions to award stickers
export function awardSticker(stickerKey) {
    stickersStore.update(stickers => {
        if (!stickers[stickerKey]) {
            stickers[stickerKey] = true;
            // Trigger celebration event
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
            stickers[key] = Math.min(stickers[key] + stars, 99); // Cap at 99 stars
        }
        return stickers;
    });
}

// Check daily streak
export function updateStreak() {
    stickersStore.update(stickers => {
        const today = new Date().toDateString();
        
        if (stickers.lastPlayDate === today) {
            return stickers; // Already played today
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (stickers.lastPlayDate === yesterdayStr) {
            // Continue streak!
            stickers.dailyStreak += 1;
            stickers.bestStreak = Math.max(stickers.bestStreak, stickers.dailyStreak);
        } else if (stickers.lastPlayDate !== today) {
            // Streak broken, reset
            stickers.dailyStreak = 1;
        }
        
        stickers.lastPlayDate = today;
        return stickers;
    });
}

// Calculate overall progress percentage
export function calculateOverallProgress(progress) {
    const weights = {
        helpVisitor: 25,
        safeWalk: 25,
        shortQA: 25,
        tripPlanner: 15,
        learnPlaces: 10
    };
    
    let score = 0;
    
    // HelpVisitor: based on total completed (max 20 for 100%)
    score += Math.min(progress.helpVisitor.totalCompleted / 20, 1) * weights.helpVisitor;
    
    // SafeWalk: based on scenarios completed (max 10 for 100%)
    score += Math.min(progress.safeWalk.scenariosCompleted / 10, 1) * weights.safeWalk;
    
    // ShortQA: based on correct answers (max 30 for 100%)
    score += Math.min(progress.shortQA.correctAnswers / 30, 1) * weights.shortQA;
    
    // TripPlanner: based on trips planned (max 5 for 100%)
    score += Math.min(progress.tripPlanner.tripsPlanned / 5, 1) * weights.tripPlanner;
    
    // LearnPlaces: based on unique places viewed (max 20 for 100%)
    score += Math.min(progress.learnPlaces.placesViewed.length / 20, 1) * weights.learnPlaces;
    
    return Math.round(score);
}
