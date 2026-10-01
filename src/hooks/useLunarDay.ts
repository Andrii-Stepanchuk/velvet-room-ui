import { useMemo } from 'react';

import {
  daysUntilFullMoon,
  getBoosts,
  getLunarCycle,
  getMoonState,
  nextFullMoonDate,
  type Boosts,
  type LunarCycle,
  type MoonState,
} from '@/lib/game';
import { useBoostOverrides } from '@/lib/state/boostOverrides';
import { useNow } from './useNow';

export interface LunarDay {
  now: Date;
  moon: MoonState;
  daysUntilFullMoon: number;
  nextFullMoon: Date;
  cycle: LunarCycle;
  boosts: Boosts;
}

function atTimeOf(day: Date, time: Date): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.getHours(), time.getMinutes());
}

export function useLunarDay(): LunarDay {
  const clock = useNow();
  const forceFullMoon = useBoostOverrides((state) => state.fullMoon);
  const forceDarkHour = useBoostOverrides((state) => state.darkHour);

  return useMemo(() => {
    const now = forceFullMoon ? atTimeOf(nextFullMoonDate(clock), clock) : clock;
    return {
      now,
      moon: getMoonState(now),
      daysUntilFullMoon: daysUntilFullMoon(now),
      nextFullMoon: nextFullMoonDate(now),
      cycle: getLunarCycle(now),
      boosts: getBoosts(now, { darkHour: forceDarkHour }),
    };
  }, [clock, forceFullMoon, forceDarkHour]);
}
