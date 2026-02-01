// src/utils/constants.js
export const EXAM_CATEGORIES = {
  FINANCE: 'finance',
  GOVERNMENT: 'govt',
  MEDICAL: 'medical',
  ENGINEERING: 'engineering',
  LAW: 'law',
  DEFENSE: 'defense',
  BANKING: 'banking',
  MANAGEMENT: 'management'
};

export const EXAM_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

export const STUDY_MODES = {
  INTENSIVE: 'intensive',
  BALANCED: 'balanced',
  RELAXED: 'relaxed'
};

export const SCHEDULE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom'
};

export const DIFFICULTY_LEVELS = [
  { id: 'easy', label: 'Easy', color: 'green', hoursPerDay: 4 },
  { id: 'medium', label: 'Medium', color: 'yellow', hoursPerDay: 6 },
  { id: 'hard', label: 'Hard', color: 'orange', hoursPerDay: 8 },
  { id: 'extreme', label: 'Extreme', color: 'red', hoursPerDay: 10 }
];

export const AI_MODELS = {
  GPT4: 'gpt-4',
  CLAUDE: 'claude-3',
  GEMINI: 'gemini-pro',
  LOCAL: 'local-llm'
};
