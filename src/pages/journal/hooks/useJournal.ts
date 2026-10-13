import { useCallback, useMemo } from 'react';

import { usePlayer, useProgress } from '@/lib/data/hooks';
import type { XpAwardRow } from '@/lib/db/schema';
import {
  addDays,
  daySummary,
  daysBetween,
  firstJournalDay,
  groupByDay,
  ledgerMilestones,
  tallyDay,
  type DayKey,
  type DaySummary,
  type Milestone,
} from '@/lib/game';

export type JournalEvent =
  | { kind: 'clear'; key: string; award: XpAwardRow }
  | { kind: 'milestone'; key: string; milestone: Milestone };

export interface JournalDay {
  day: DayKey;
  events: readonly JournalEvent[];
  summary: DaySummary;
}

const NO_AWARDS: readonly XpAwardRow[] = [];

export function useJournal() {
  const { ledger, dayLogs, quests: todayEntries, today } = useProgress();
  const { player } = usePlayer();
  const byDay = useMemo(() => groupByDay(ledger), [ledger]);
  const milestones = useMemo(() => ledgerMilestones(ledger), [ledger]);
  const logs = useMemo(() => new Map(dayLogs.map((log) => [log.day, log])), [dayLogs]);
  const todayTally = useMemo(() => tallyDay(todayEntries), [todayEntries]);
  const first = useMemo(() => firstJournalDay(player?.createdAt ?? null, ledger, today), [player?.createdAt, ledger, today]);
  const lastIndex = daysBetween(first, today);

  const dayAt = useCallback((index: number) => addDays(first, index), [first]);
  const indexOf = useCallback((day: DayKey) => daysBetween(first, day), [first]);

  const entry = useCallback(
    (day: DayKey): JournalDay => {
      const awards = byDay.get(day) ?? NO_AWARDS;
      const events: JournalEvent[] = [];
      for (const award of awards) {
        events.push({ kind: 'clear', key: `a${award.id}`, award });
        for (const milestone of milestones.get(award.id) ?? []) {
          events.push({ kind: 'milestone', key: `m${award.id}${milestone.kind}`, milestone });
        }
      }
      const log = logs.get(day);
      const tally = day === today ? todayTally : log ? { scheduled: log.scheduled, cleared: log.cleared } : null;
      return { day, events, summary: daySummary(awards, tally) };
    },
    [byDay, milestones, logs, today, todayTally],
  );

  return { today, first, lastIndex, dayAt, indexOf, entry };
}
