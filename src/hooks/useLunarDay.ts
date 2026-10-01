import { useMemo } from 'react';

import { daysUntilFullMoon, getBoosts, getMoonState, nextFullMoonDate, type Boosts, type MoonState } from '@/lib/game';
import { useNow } from './useNow';

export interface LunarDay {
  now: Date;
  moon: MoonState;
  daysUntilFullMoon: number;
  nextFullMoon: Date;
  boosts: Boosts;
}

export function useLunarDay(): LunarDay {
  const now = useNow();
  return useMemo(
    () => ({
      now,
      moon: getMoonState(now),
      daysUntilFullMoon: daysUntilFullMoon(now),
      nextFullMoon: nextFullMoonDate(now),
      boosts: getBoosts(now),
    }),
    [now],
  );
}
