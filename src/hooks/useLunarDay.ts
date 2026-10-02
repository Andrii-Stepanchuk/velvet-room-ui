import { useMemo } from 'react';

import {
  boostsAt,
  daysUntilFullMoon,
  getLunarCycle,
  getMoonState,
  nextFullMoonDate,
  opensDarkHourEarly,
  skyDate,
  type Boosts,
  type LunarCycle,
  type MoonState,
} from '@/lib/game';
import { useProgress } from '@/lib/data/hooks';
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

export function useLunarDay(): LunarDay {
  const clock = useNow();
  const forceFullMoon = useBoostOverrides((state) => state.fullMoon);
  const forceDarkHour = useBoostOverrides((state) => state.darkHour);
  const { arcana } = useProgress();
  const early = opensDarkHourEarly(arcana.id);

  return useMemo(() => {
    const overrides = { darkHour: forceDarkHour, fullMoon: forceFullMoon };
    const now = skyDate(clock, overrides);
    return {
      now,
      moon: getMoonState(now),
      daysUntilFullMoon: daysUntilFullMoon(now),
      nextFullMoon: nextFullMoonDate(now),
      cycle: getLunarCycle(now),
      boosts: boostsAt(clock, overrides, early),
    };
  }, [clock, forceFullMoon, forceDarkHour, early]);
}
