import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { StatKey } from '@/lib/game';

const GLYPHS: Record<StatKey, readonly string[]> = {
  knowledge: ['M12 6.5C10.5 5.3 8.3 4.8 4 5v13c4.3-.2 6.5.3 8 1.5 1.5-1.2 3.7-1.7 8-1.5V5c-4.3-.2-6.5.3-8 1.5z', 'M12 6.5V19'],
  guts: ['M12 3c.5 3.5 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.8 1.2 2.8 2.5 3.3C11 9.5 11 6 12 3z'],
  proficiency: ['M12.5 6l3.5-3 5 5-3 3.5z', 'M15 9L4.5 19.5'],
  kindness: ['M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z'],
  charm: ['M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z'],
};

export const StatIcon = memo(function StatIcon({ stat, size, color }: { stat: StatKey; size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {GLYPHS[stat].map((d) => (
        <Path
          key={d}
          d={d}
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </Svg>
  );
});
