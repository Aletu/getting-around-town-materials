// ============================================================
//  App-wide constants — change game balance here, not in code
// ============================================================

// Gamification — XP thresholds to reach each level
export const XP_PER_STAR   = 10;
export const XP_LEVEL_2    = 100;   // Beginner    → Intermediate
export const XP_LEVEL_3    = 250;   // Intermediate → Advanced
export const MAX_STARS     = 99;    // Cap per-module star counter

// Level labels used in UI and profile
export const LEVEL_NAMES = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Advanced',
};

// Session lengths per module (how many items per play-through)
export const HELP_VISITOR_SESSION  = 10;
export const SHORT_QA_SESSION      = 5;
export const SAFE_WALK_SESSION     = 3;
export const MAP_QUEST_SESSION     = 3;

// How many items are unlocked at each level (HelpVisitor / ShortQA / SafeWalk / MapQuest)
export const HELP_VISITOR_LEVEL_CAPS  = { 1: 5,  2: 10, 3: Infinity };
export const SHORT_QA_LEVEL_CAPS      = { 1: 7,  2: 14, 3: Infinity };
export const SAFE_WALK_LEVEL_CAPS     = { 1: 10, 2: 20, 3: Infinity };
export const MAP_QUEST_LEVEL_CAPS     = { 1: 6,  2: 10, 3: Infinity };

// Input validation limits for Teacher Mode
export const VALIDATION = {
    SCENARIO_TEXT_MAX:   300,
    SCENARIO_HINT_MAX:   200,
    QA_QUESTION_MAX:     250,
    QA_OPTION_MAX:       120,
    SEQUENCE_TITLE_MAX:  150,
    SEQUENCE_STEP_MAX:   200,
};
