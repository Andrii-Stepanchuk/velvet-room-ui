import type { OverallProgress, Quest, StatProgress } from '@/lib/game';

export const SEED_STATS: readonly StatProgress[] = [
  { key: 'knowledge', level: 5, xp: 340, maxXp: 500 },
  { key: 'guts', level: 3, xp: 120, maxXp: 400 },
  { key: 'proficiency', level: 4, xp: 290, maxXp: 450 },
  { key: 'kindness', level: 6, xp: 410, maxXp: 600 },
  { key: 'charm', level: 2, xp: 80, maxXp: 350 },
];

export const SEED_OVERALL: OverallProgress = { level: 24, xp: 720, maxXp: 1000 };

export const SEED_QUESTS: readonly Quest[] = [
  { id: 'deep-work', title: 'Deep work block — 90 min', stat: 'knowledge', baseXp: 80, done: true },
  { id: 'read', title: 'Read 20 pages', stat: 'knowledge', baseXp: 45, done: true },
  { id: 'cold-shower', title: 'Cold shower', stat: 'guts', baseXp: 40, done: false },
  { id: 'guitar', title: 'Guitar practice — 30 min', stat: 'proficiency', baseXp: 60, done: true },
  { id: 'call-dad', title: 'Call Dad', stat: 'kindness', baseXp: 50, done: false },
  { id: 'neighbour', title: 'Say hi to a new neighbour', stat: 'charm', baseXp: 35, done: false },
];

export const SEED_STREAK = 4;
