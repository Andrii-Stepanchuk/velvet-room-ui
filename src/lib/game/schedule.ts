import type { Challenge, Effort } from './questXp';
import type { StatKey } from './stats';

export type Repeat = 'once' | 'daily' | 'days';

export type DayKey = string;

export interface QuestDef {
  id: number;
  title: string;
  stat: StatKey;
  effort: Effort;
  challenge: Challenge;
  repeat: Repeat;
  repeatDays: number;
  date: DayKey | null;
  note: string | null;
  createdAt: Date;
  archivedAt: Date | null;
}

export interface AwardRef {
  questId: number;
  day: DayKey;
}

export interface DayEntry<C extends AwardRef = AwardRef, Q extends QuestDef = QuestDef> {
  quest: Q;
  day: DayKey;
  done: boolean;
  award: C | null;
  carriedFrom: DayKey | null;
}

export const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;
export const ALL_DAYS_MASK = 0b1111111;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function dayKey(date: Date): DayKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDay(day: DayKey): Date {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(day: DayKey, count: number): DayKey {
  const date = parseDay(day);
  date.setDate(date.getDate() + count);
  return dayKey(date);
}

export function daysBetween(from: DayKey, to: DayKey): number {
  return Math.round((parseDay(to).getTime() - parseDay(from).getTime()) / 86_400_000);
}

export function weekdayOf(day: DayKey): number {
  return parseDay(day).getDay();
}

export function hasWeekday(mask: number, weekday: number): boolean {
  return (mask & (1 << weekday)) !== 0;
}

export function toggleWeekday(mask: number, weekday: number): number {
  return mask ^ (1 << weekday);
}

export function nextDays(from: DayKey, count: number): DayKey[] {
  return Array.from({ length: count }, (_, i) => addDays(from, i));
}

function isLive(quest: QuestDef, day: DayKey): boolean {
  return quest.archivedAt === null || dayKey(quest.archivedAt) > day;
}

export function recursOn(quest: QuestDef, day: DayKey): boolean {
  if (quest.repeat === 'daily') return true;
  if (quest.repeat === 'days') return hasWeekday(quest.repeatDays, weekdayOf(day));
  return false;
}

export function entryFor<C extends AwardRef, Q extends QuestDef>(
  quest: Q,
  day: DayKey,
  today: DayKey,
  awards: readonly C[],
): DayEntry<C, Q> | null {
  if (!isLive(quest, day)) return null;
  const own = awards.filter((c) => c.questId === quest.id);
  const onDay = own.find((c) => c.day === day) ?? null;

  if (quest.repeat !== 'once') {
    if (day < dayKey(quest.createdAt) || !recursOn(quest, day)) return null;
    return { quest, day, done: onDay !== null, award: onDay, carriedFrom: null };
  }

  const date = quest.date ?? dayKey(quest.createdAt);
  const doneDay = own.reduce<DayKey | null>((min, c) => (min === null || c.day < min ? c.day : min), null);
  if (doneDay !== null) {
    if (day === doneDay) return { quest, day, done: true, award: onDay, carriedFrom: doneDay > date ? date : null };
    if (date <= day && day < doneDay) return { quest, day, done: false, award: null, carriedFrom: day > date ? date : null };
    return null;
  }
  if (day === date) return { quest, day, done: false, award: null, carriedFrom: null };
  if (date < day && day <= today) return { quest, day, done: false, award: null, carriedFrom: date };
  return null;
}

export function entriesForDay<C extends AwardRef, Q extends QuestDef>(
  quests: readonly Q[],
  awards: readonly C[],
  day: DayKey,
  today: DayKey,
): DayEntry<C, Q>[] {
  const entries: DayEntry<C, Q>[] = [];
  for (const quest of quests) {
    const entry = entryFor(quest, day, today, awards);
    if (entry) entries.push(entry);
  }
  return entries;
}

export function canClearOn(quest: QuestDef, day: DayKey, awards: readonly AwardRef[]): boolean {
  if (quest.archivedAt !== null) return false;
  const own = awards.filter((c) => c.questId === quest.id);
  if (quest.repeat === 'once') return own.length === 0;
  return day >= dayKey(quest.createdAt) && recursOn(quest, day) && !own.some((c) => c.day === day);
}

export interface DayTally {
  scheduled: number;
  cleared: number;
}

export function tallyDay(entries: readonly { done: boolean }[]): DayTally {
  return { scheduled: entries.length, cleared: entries.filter((e) => e.done).length };
}
