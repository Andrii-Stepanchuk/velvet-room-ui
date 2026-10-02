import { useCallback } from 'react';

import { useLunarDay } from '@/hooks/useLunarDay';
import { useNow } from '@/hooks/useNow';
import { useProgress } from '@/lib/data/hooks';
import { computeAward, type Award, type Challenge, type Effort, type StatKey } from '@/lib/game';

export interface PreviewInput {
  questId: number;
  stat: StatKey;
  effort: Effort;
  challenge: Challenge;
}

export type AwardPreview = (input: PreviewInput) => Award;

export function useAwardPreview(): AwardPreview {
  const progress = useProgress();
  const { boosts } = useLunarDay();
  const clock = useNow();

  return useCallback(
    (input: PreviewInput) => {
      const day = progress.today;
      return computeAward({
        ...input,
        at: clock,
        day,
        boosts,
        stats: progress.stats,
        clearedStatsToday: progress.ledger.filter((a) => a.day === day).map((a) => a.stat),
        streak: progress.streak,
        clearsDay: progress.quests.filter((e) => e.quest.id !== input.questId).every((e) => e.done),
        arcanaId: progress.arcana.id,
      });
    },
    [progress, boosts, clock],
  );
}
