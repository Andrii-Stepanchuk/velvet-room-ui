import { CONFIG } from '@/constants/config';
import type { ArcanaId } from './arcanaData';
import type { Boosts } from './boosts';
import { LARGE_EFFORTS, type Challenge, type Effort } from './questXp';
import type { DayKey } from './schedule';
import type { StatKey, StatProgress } from './stats';

export type BlessingTarget = 'all' | 'lowest' | readonly StatKey[];

export type BlessingCondition =
  | { kind: 'always' }
  | { kind: 'darkHour' }
  | { kind: 'fullMoon' }
  | { kind: 'beforeNoon' }
  | { kind: 'large' }
  | { kind: 'hard' }
  | { kind: 'after'; stat: StatKey }
  | { kind: 'streak' }
  | { kind: 'balanced' }
  | { kind: 'clearsDay' }
  | { kind: 'fortune' };

export interface BlessingRule {
  pct: number;
  on: BlessingTarget;
  when: BlessingCondition;
  earlyDarkHour?: boolean;
}

const ALWAYS = { kind: 'always' } as const;
const DARK_HOUR = { kind: 'darkHour' } as const;

export const BLESSINGS: Record<ArcanaId, BlessingRule> = {
  fool: { pct: 0.1, on: 'lowest', when: ALWAYS },
  magician: { pct: 0.1, on: ['proficiency'], when: { kind: 'after', stat: 'knowledge' } },
  priestess: { pct: 0.1, on: ['knowledge'], when: DARK_HOUR },
  empress: { pct: 0.1, on: ['kindness'], when: ALWAYS },
  emperor: { pct: 0.1, on: ['charm'], when: ALWAYS },
  hierophant: { pct: 0.1, on: ['kindness'], when: { kind: 'after', stat: 'knowledge' } },
  lovers: { pct: 0.05, on: ['kindness', 'charm'], when: ALWAYS },
  chariot: { pct: 0.1, on: 'all', when: { kind: 'streak' } },
  justice: { pct: 0.1, on: ['knowledge'], when: ALWAYS },
  hermit: { pct: 0.1, on: ['proficiency'], when: DARK_HOUR },
  fortune: { pct: 1, on: 'all', when: { kind: 'fortune' } },
  strength: { pct: 0.1, on: 'all', when: { kind: 'hard' } },
  hanged: { pct: 0.1, on: ['kindness'], when: DARK_HOUR },
  death: { pct: 0.1, on: 'all', when: { kind: 'large' } },
  temperance: { pct: 0.05, on: 'all', when: { kind: 'balanced' } },
  devil: { pct: 0.1, on: ['charm'], when: DARK_HOUR },
  tower: { pct: 0.1, on: ['guts'], when: ALWAYS },
  star: { pct: 0.1, on: ['kindness', 'knowledge'], when: { kind: 'fullMoon' } },
  moon: { pct: 0, on: 'all', when: ALWAYS, earlyDarkHour: true },
  sun: { pct: 0.1, on: 'all', when: { kind: 'beforeNoon' } },
  judgement: { pct: 0.1, on: 'all', when: { kind: 'clearsDay' } },
  world: { pct: 0.1, on: 'all', when: ALWAYS },
};

export interface BlessingContext {
  questId: number;
  stat: StatKey;
  effort: Effort;
  challenge: Challenge;
  at: Date;
  day: DayKey;
  boosts: Pick<Boosts, 'darkHour' | 'fullMoon'>;
  stats: readonly StatProgress[];
  clearedStatsToday: readonly StatKey[];
  streak: number;
  clearsDay: boolean;
}

export function opensDarkHourEarly(arcana: ArcanaId): boolean {
  return BLESSINGS[arcana].earlyDarkHour === true;
}

export function fortuneHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

export function isFortuneTurned(questId: number, day: DayKey): boolean {
  return questId > 0 && fortuneHash(`${questId}:${day}`) % CONFIG.blessings.fortuneOdds === 0;
}

function lowestStats(stats: readonly StatProgress[]): StatKey[] {
  if (stats.length === 0) return [];
  const min = Math.min(...stats.map((s) => s.level));
  return stats.filter((s) => s.level === min).map((s) => s.key);
}

function spread(stats: readonly StatProgress[]): number {
  if (stats.length === 0) return 0;
  const levels = stats.map((s) => s.level);
  return Math.max(...levels) - Math.min(...levels);
}

function targets(on: BlessingTarget, ctx: BlessingContext): boolean {
  if (on === 'all') return true;
  if (on === 'lowest') return lowestStats(ctx.stats).includes(ctx.stat);
  return on.includes(ctx.stat);
}

function holds(when: BlessingCondition, ctx: BlessingContext): boolean {
  switch (when.kind) {
    case 'always':
      return true;
    case 'darkHour':
      return ctx.boosts.darkHour;
    case 'fullMoon':
      return ctx.boosts.fullMoon;
    case 'beforeNoon':
      return ctx.at.getHours() < CONFIG.blessings.noonHour;
    case 'large':
      return LARGE_EFFORTS.includes(ctx.effort);
    case 'hard':
      return ctx.challenge === 'hard';
    case 'after':
      return ctx.clearedStatsToday.includes(when.stat);
    case 'streak':
      return ctx.streak >= CONFIG.blessings.chariotStreak;
    case 'balanced':
      return spread(ctx.stats) <= CONFIG.blessings.temperanceSpread;
    case 'clearsDay':
      return ctx.clearsDay;
    case 'fortune':
      return isFortuneTurned(ctx.questId, ctx.day);
  }
}

export function blessingBonus(arcana: ArcanaId, ctx: BlessingContext): number {
  const rule = BLESSINGS[arcana];
  if (rule.pct === 0) return 0;
  return targets(rule.on, ctx) && holds(rule.when, ctx) ? rule.pct : 0;
}
