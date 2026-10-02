import { CONFIG } from '@/constants/config';
import { STAT_KEYS, type StatKey, type StatProgress } from './stats';
import type { OverallProgress } from './progress';

export interface Curve {
  base: number;
  growth: number;
  maxLevel: number;
}

export interface LevelProgress {
  level: number;
  xp: number;
  maxXp: number;
  maxed: boolean;
  total: number;
}

export function progressFromTotal(total: number, curve: Curve): LevelProgress {
  let level = 1;
  let xp = Math.max(0, total);
  let maxXp = curve.base;
  while (xp >= maxXp && level < curve.maxLevel) {
    xp -= maxXp;
    level += 1;
    maxXp = Math.round(maxXp * curve.growth);
  }
  const maxed = level >= curve.maxLevel;
  return { level, xp: maxed ? maxXp : xp, maxXp, maxed, total: Math.max(0, total) };
}

export function totalForLevel(level: number, curve: Curve): number {
  let total = 0;
  let maxXp = curve.base;
  for (let l = 1; l < Math.min(level, curve.maxLevel); l += 1) {
    total += maxXp;
    maxXp = Math.round(maxXp * curve.growth);
  }
  return total;
}

export type StatTotals = Record<StatKey, number>;

export function emptyTotals(): StatTotals {
  return { knowledge: 0, guts: 0, proficiency: 0, kindness: 0, charm: 0 };
}

export interface StatLevel extends StatProgress {
  maxed: boolean;
  total: number;
}

export function statProgressFromTotals(totals: Partial<StatTotals>): StatLevel[] {
  return STAT_KEYS.map((key) => ({ key, ...progressFromTotal(totals[key] ?? 0, CONFIG.curves.stat) }));
}

export interface OverallLevel extends OverallProgress {
  maxed: boolean;
  total: number;
}

export function overallFromTotal(total: number): OverallLevel {
  return progressFromTotal(total, CONFIG.curves.overall);
}
