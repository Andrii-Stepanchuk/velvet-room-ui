import { memo } from 'react';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { moonLitPath } from '@/lib/moonPath';

const MOON_LIGHT = ['#f6f8ff', '#c5cae6'] as const;
const MOON_SHADOW = '#111838';

export const MoonDisc = memo(function MoonDisc({
  size,
  illumination,
  waxing,
}: {
  size: number;
  illumination: number;
  waxing: boolean;
}) {
  const r = size / 2;
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id="moonLight" cx="40%" cy="35%" r="70%">
          <Stop offset={0} stopColor={MOON_LIGHT[0]} />
          <Stop offset={1} stopColor={MOON_LIGHT[1]} />
        </RadialGradient>
      </Defs>
      <Circle cx={r} cy={r} r={r} fill={MOON_SHADOW} />
      <Path d={moonLitPath(r, illumination, waxing)} fill="url(#moonLight)" />
    </Svg>
  );
});
