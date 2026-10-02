import { useMemo } from 'react';

import { useProgress } from '@/lib/data/hooks';
import { STAT_DEFS, nextRankName, rankName, rankPath, xpFraction, xpToNext, type StatKey } from '@/lib/game';

export function useStatDetail(key: StatKey) {
  const { stats } = useProgress();
  return useMemo(() => {
    const stat = stats.find((s) => s.key === key) ?? stats[0];
    return {
      stat,
      def: STAT_DEFS[stat.key],
      rank: rankName(stat.key, stat.level),
      nextRank: nextRankName(stat),
      fraction: xpFraction(stat),
      toNext: xpToNext(stat),
      path: rankPath(stat),
    };
  }, [key, stats]);
}
