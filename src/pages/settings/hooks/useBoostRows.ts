import { useMemo } from 'react';

import { CONFIG } from '@/constants/config';
import { formatHour, formatMultiplier, formatShortDate } from '@/lib/format';

export interface BoostRow {
  label: string;
  value: string;
}

export function useBoostRows(nextFullMoon: Date, daysUntilFullMoon: number): readonly BoostRow[] {
  return useMemo(() => {
    const { darkHour, fullMoonMultiplier, cap } = CONFIG.boosts;
    return [
      {
        label: 'DARK HOUR',
        value: `${formatHour(darkHour.startHour)}–${formatHour(darkHour.endHour)} · ${formatMultiplier(darkHour.multiplier)}`,
      },
      { label: 'FULL MOON', value: `All day · ${formatMultiplier(fullMoonMultiplier)}` },
      { label: 'STACKED', value: `Capped at ${formatMultiplier(cap)}` },
      { label: 'NEXT FULL MOON', value: daysUntilFullMoon === 0 ? 'Now' : formatShortDate(nextFullMoon) },
    ];
  }, [nextFullMoon, daysUntilFullMoon]);
}
