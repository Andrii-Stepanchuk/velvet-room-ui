import { useMemo } from 'react';

import { useLunarDay } from '@/hooks/useLunarDay';
import { usePlayer, useProgress } from '@/lib/data/hooks';
import { questMessage, summarizeQuests, xpFraction, xpToNext } from '@/lib/game';

export function useStatusModel() {
  const { player } = usePlayer();
  const { now, moon, cycle, daysUntilFullMoon, boosts } = useLunarDay();
  const { stats, overall, quests, streak, arcana } = useProgress();
  const name = player?.name ?? '';

  return useMemo(() => {
    const questSummary = summarizeQuests(quests);
    return {
      name,
      now,
      moon,
      cycle,
      daysUntilFullMoon,
      boosts,
      stats,
      overall,
      xpFraction: xpFraction(overall),
      xpToNext: xpToNext(overall),
      arcana,
      questSummary,
      questMessage: questMessage(questSummary, streak),
    };
  }, [name, now, moon, cycle, daysUntilFullMoon, boosts, stats, overall, quests, streak, arcana]);
}
