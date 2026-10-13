import { CONFIG } from '@/constants/config';
import { overallFromTotal, progressFromTotal, emptyTotals } from './levels';
import { addDays, dayKey, type DayKey, type DayTally } from './schedule';
import type { StatKey } from './stats';

export interface JournalAward {
  id: number;
  day: DayKey;
  completedAt: Date;
  stat: StatKey;
  awardedXp: number;
}

export type Milestone =
  | { kind: 'rank'; awardId: number; stat: StatKey; level: number }
  | { kind: 'level'; awardId: number; level: number };

export interface DaySummary {
  xp: number;
  cleared: number;
  scheduled: number | null;
}

function chronological<A extends JournalAward>(a: A, b: A): number {
  return a.completedAt.getTime() - b.completedAt.getTime() || a.id - b.id;
}

export function groupByDay<A extends JournalAward>(ledger: readonly A[]): Map<DayKey, A[]> {
  const days = new Map<DayKey, A[]>();
  for (const award of ledger) {
    const list = days.get(award.day);
    if (list) list.push(award);
    else days.set(award.day, [award]);
  }
  for (const list of days.values()) list.sort(chronological);
  return days;
}

export function ledgerMilestones(ledger: readonly JournalAward[]): Map<number, Milestone[]> {
  const totals = emptyTotals();
  let overall = 0;
  const milestones = new Map<number, Milestone[]>();
  for (const award of [...ledger].sort(chronological)) {
    const statBefore = progressFromTotal(totals[award.stat], CONFIG.curves.stat).level;
    const overallBefore = overallFromTotal(overall).level;
    totals[award.stat] += award.awardedXp;
    overall += award.awardedXp;
    const statAfter = progressFromTotal(totals[award.stat], CONFIG.curves.stat).level;
    const overallAfter = overallFromTotal(overall).level;
    const found: Milestone[] = [];
    if (statAfter > statBefore) found.push({ kind: 'rank', awardId: award.id, stat: award.stat, level: statAfter });
    if (overallAfter > overallBefore) found.push({ kind: 'level', awardId: award.id, level: overallAfter });
    if (found.length > 0) milestones.set(award.id, found);
  }
  return milestones;
}

export function daySummary(awards: readonly JournalAward[], tally: DayTally | null): DaySummary {
  const xp = awards.reduce((sum, award) => sum + award.awardedXp, 0);
  return { xp, cleared: tally?.cleared ?? awards.length, scheduled: tally?.scheduled ?? null };
}

export function firstJournalDay(joined: Date | null, ledger: readonly JournalAward[], today: DayKey): DayKey {
  let first = joined ? dayKey(joined) : today;
  for (const award of ledger) if (award.day < first) first = award.day;
  return first < today ? first : today;
}

export function monthGrid(year: number, month: number): (DayKey | null)[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const length = new Date(year, month + 1, 0).getDate();
  const start = dayKey(first);
  const cells: (DayKey | null)[] = Array.from({ length: lead }, () => null);
  for (let i = 0; i < length; i += 1) cells.push(addDays(start, i));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
