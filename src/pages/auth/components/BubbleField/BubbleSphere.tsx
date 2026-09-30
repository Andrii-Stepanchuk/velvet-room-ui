import { memo } from 'react';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';

const BUBBLE_STROKE = 'rgba(200,240,255,0.55)';
const BUBBLE_STOPS = [
  { offset: 0.08, color: colors.white, opacity: 0.95 },
  { offset: 0.22, color: '#beebff', opacity: 0.34 },
  { offset: 0.52, color: '#7dc8ff', opacity: 0.1 },
  { offset: 0.78, color: '#a0e1ff', opacity: 0.22 },
  { offset: 1, color: '#d7f5ff', opacity: 0.6 },
] as const;

export const BubbleSphere = memo(function BubbleSphere({ size }: { size: number }) {
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id="bubble" cx="32%" cy="28%" r="75%">
          {BUBBLE_STOPS.map((s) => (
            <Stop key={s.offset} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
          ))}
        </RadialGradient>
      </Defs>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 0.5}
        fill="url(#bubble)"
        stroke={BUBBLE_STROKE}
        strokeWidth={1}
      />
    </Svg>
  );
});
