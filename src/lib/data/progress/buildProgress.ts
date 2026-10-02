import type { XpAwardRow, DayLogRow, QuestRow } from '@/lib/db/schema';
import {
  deriveArcana,
  emptyTotals,
  entriesForDay,
  overallFromTotal,
  statProgressFromTotals,
  streakFrom,
  tallyDay,
  type Arcana,
  type DayEntry,
  type DayKey,
  type OverallLevel,
  type StatLevel,
  type StatTotals,
} from '@/lib/game';

export type TodayEntry = DayEntry<XpAwardRow, QuestRow>;

export interface Progress {
  today: DayKey;
  catalog: readonly QuestRow[];
  ledger: readonly XpAwardRow[];
  totals: StatTotals;
  stats: readonly StatLevel[];
  overall: OverallLevel;
  arcana: Arcana;
  quests: readonly TodayEntry[];
  streak: number;
}

export function buildProgress(
  quests: readonly QuestRow[],
  ledger: readonly XpAwardRow[],
  dayLogs: readonly DayLogRow[],
  today: DayKey,
): Progress {
  const totals = emptyTotals();
  let overallTotal = 0;
  for (const entry of ledger) {
    totals[entry.stat] += entry.awardedXp;
    overallTotal += entry.awardedXp;
  }
  const stats = statProgressFromTotals(totals);
  const todayEntries = entriesForDay(quests, ledger, today, today);
  return {
    today,
    catalog: quests,
    ledger,
    totals,
    stats,
    overall: overallFromTotal(overallTotal),
    arcana: deriveArcana(stats),
    quests: todayEntries,
    streak: streakFrom(dayLogs, today, tallyDay(todayEntries)),
  };
}
