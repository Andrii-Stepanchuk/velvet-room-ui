import { useMemo } from 'react';

import { CONFIG } from '@/constants/config';
import type { Boosts } from '@/lib/game';
import { formatHour, formatMultiplier, formatShortDate } from '@/lib/format';

export type BoostKey = 'darkHour' | 'fullMoon' | 'stacked';

export interface BoostRow {
  key: BoostKey;
  value: string;
  unit: string;
  caption: string;
  live: boolean;
  label: string;
}

function row(key: BoostKey, value: string, unit: string, caption: string, live: boolean): BoostRow {
  return { key, value, unit, caption, live, label: `${unit}, ${value}, ${caption}${live ? ', live now' : ''}` };
}

export function useBoostRows(nextFullMoon: Date, daysUntilFullMoon: number, boosts: Boosts): readonly BoostRow[] {
  return useMemo(() => {
    const { darkHour, fullMoonMultiplier, cap } = CONFIG.boosts;
    const stacked = Math.min(darkHour.multiplier * fullMoonMultiplier, cap);
    const next = daysUntilFullMoon === 0 ? 'TODAY' : `NEXT ${formatShortDate(nextFullMoon)}`;
    return [
      row(
        'darkHour',
        formatMultiplier(darkHour.multiplier),
        'DARK HOUR',
        `${formatHour(darkHour.startHour)}–${formatHour(darkHour.endHour)} · NIGHTLY`,
        boosts.darkHour,
      ),
      row('fullMoon', formatMultiplier(fullMoonMultiplier), 'FULL MOON', `ALL DAY · ${next}`, boosts.fullMoon),
      row(
        'stacked',
        formatMultiplier(stacked),
        'BOTH',
        stacked >= cap ? 'STACKED · THE CAP' : 'STACKED',
        boosts.darkHour && boosts.fullMoon,
      ),
    ];
  }, [nextFullMoon, daysUntilFullMoon, boosts]);
}
