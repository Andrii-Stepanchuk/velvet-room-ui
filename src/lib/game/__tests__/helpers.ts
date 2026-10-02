import type { AwardContext } from '../award';
import type { ArcanaId } from '../arcanaData';
import type { QuestDef } from '../schedule';
import { STAT_KEYS, type StatKey, type StatProgress } from '../stats';

export function stats(levels: Partial<Record<StatKey, number>> = {}): StatProgress[] {
  return STAT_KEYS.map((key) => ({ key, level: levels[key] ?? 1, xp: 0, maxXp: 450 }));
}

export function at(hour: number, minute = 0, day = new Date(2026, 9, 6)): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
}

export function ctx(overrides: Partial<AwardContext> & { arcanaId: ArcanaId }): AwardContext {
  return {
    questId: 1,
    stat: 'knowledge',
    effort: 'short',
    challenge: 'routine',
    at: at(15),
    day: '2026-10-06',
    boosts: { darkHour: false, fullMoon: false, multiplier: 1 },
    stats: stats({ knowledge: 2, guts: 3, proficiency: 3, kindness: 3, charm: 3 }),
    clearedStatsToday: [],
    streak: 0,
    clearsDay: false,
    ...overrides,
  };
}

export function quest(overrides: Partial<QuestDef> = {}): QuestDef {
  return {
    id: 1,
    title: 'Quest',
    stat: 'knowledge',
    effort: 'short',
    challenge: 'routine',
    repeat: 'daily',
    repeatDays: 0,
    date: null,
    note: null,
    createdAt: new Date(2026, 9, 1, 9),
    archivedAt: null,
    ...overrides,
  };
}
