import { CONFIG } from '@/constants/config';

export type Effort = keyof typeof CONFIG.quests.effort;
export type Challenge = keyof typeof CONFIG.quests.challenge;

export interface EffortDef {
  key: Effort;
  label: string;
  hint: string;
  points: number;
}

export interface ChallengeDef {
  key: Challenge;
  label: string;
  meaning: string;
  factor: number;
}

export const EFFORTS: readonly EffortDef[] = [
  { key: 'quick', label: 'QUICK', hint: '≤15 MIN', points: CONFIG.quests.effort.quick },
  { key: 'short', label: 'SHORT', hint: '~30 MIN', points: CONFIG.quests.effort.short },
  { key: 'session', label: 'SESSION', hint: '~1 HR', points: CONFIG.quests.effort.session },
  { key: 'deep', label: 'DEEP', hint: '~2 HR', points: CONFIG.quests.effort.deep },
  { key: 'epic', label: 'EPIC', hint: '½ DAY+', points: CONFIG.quests.effort.epic },
];

export const CHALLENGES: readonly ChallengeDef[] = [
  {
    key: 'routine',
    label: 'ROUTINE',
    meaning: "You'd do it anyway; it only needs remembering.",
    factor: CONFIG.quests.challenge.routine,
  },
  {
    key: 'stretch',
    label: 'STRETCH',
    meaning: 'Pushes a little past comfort.',
    factor: CONFIG.quests.challenge.stretch,
  },
  {
    key: 'hard',
    label: 'HARD',
    meaning: "You'd rather not, which is exactly why it counts.",
    factor: CONFIG.quests.challenge.hard,
  },
];

export const LARGE_EFFORTS: readonly Effort[] = ['deep', 'epic'];

export function effortDef(key: Effort): EffortDef {
  return EFFORTS.find((e) => e.key === key) ?? EFFORTS[0];
}

export function challengeDef(key: Challenge): ChallengeDef {
  return CHALLENGES.find((c) => c.key === key) ?? CHALLENGES[0];
}

export function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5 + 1e-9);
}

export function questBaseXp(effort: Effort, challenge: Challenge): number {
  const step = CONFIG.quests.roundTo;
  return roundHalfUp((CONFIG.quests.effort[effort] * CONFIG.quests.challenge[challenge]) / step) * step;
}

export type XpBand = 'small' | 'medium' | 'large';

export function xpBand(baseXp: number): XpBand {
  if (baseXp >= 90) return 'large';
  if (baseXp >= 55) return 'medium';
  return 'small';
}
