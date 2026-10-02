import { useCallback, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import type { ClearResult } from '@/lib/data/repositories';
import type { XpAwardRow } from '@/lib/db/schema';
import { STAT_DEFS, rankName, type StatKey } from '@/lib/game';

export interface Readout {
  id: number;
  text: string;
  stat: StatKey;
  gain: boolean;
}

export interface RankUp {
  id: number;
  stat: StatKey;
  level: number;
  rank: string;
}

let nextId = 1;

export function useClearFeedback() {
  const [readouts, setReadouts] = useState<ReadonlyMap<number, Readout>>(new Map());
  const [rankUps, setRankUps] = useState<readonly RankUp[]>([]);

  const show = useCallback((questId: number, readout: Omit<Readout, 'id'>) => {
    setReadouts((current) => new Map(current).set(questId, { ...readout, id: nextId++ }));
  }, []);

  const dismissReadout = useCallback((questId: number) => {
    setReadouts((current) => {
      const next = new Map(current);
      next.delete(questId);
      return next;
    });
  }, []);

  const cleared = useCallback(
    (results: readonly ClearResult[]) => {
      const gained: RankUp[] = [];
      for (const result of results) {
        const name = STAT_DEFS[result.stat].name.toUpperCase();
        show(result.questId, { text: `+${result.award.awarded} ${name}`, stat: result.stat, gain: true });
        if (result.levelAfter > result.levelBefore) {
          gained.push({
            id: nextId++,
            stat: result.stat,
            level: result.levelAfter,
            rank: rankName(result.stat, result.levelAfter),
          });
        }
      }
      const total = results.reduce((sum, r) => sum + r.award.awarded, 0);
      if (results.length > 0) AccessibilityInfo.announceForAccessibility(`Cleared. ${total} XP earned.`);
      if (gained.length > 0) {
        setRankUps((current) => [...current, ...gained]);
        const last = gained[gained.length - 1];
        AccessibilityInfo.announceForAccessibility(`Rank up. ${STAT_DEFS[last.stat].name} is now ${last.rank}.`);
      }
    },
    [show],
  );

  const undone = useCallback(
    (row: XpAwardRow) => {
      show(row.questId, { text: `−${row.awardedXp}`, stat: row.stat, gain: false });
      AccessibilityInfo.announceForAccessibility(`Undone. ${row.awardedXp} XP removed.`);
    },
    [show],
  );

  const dismissRankUp = useCallback(() => setRankUps((current) => current.slice(1)), []);

  return { readouts, dismissReadout, rankUp: rankUps[0] ?? null, dismissRankUp, cleared, undone };
}
