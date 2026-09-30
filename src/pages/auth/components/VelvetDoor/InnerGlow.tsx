import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';
import { DOOR_H, DOOR_W } from '../../config/doorSize';

export function InnerGlow() {
  return (
    <Svg width={DOOR_W - 16} height={DOOR_H - 16}>
      <Defs>
        <RadialGradient id="doorGlow" cx="50%" cy="38%" rx="62%" ry="55%">
          <Stop offset="0" stopColor={colors.white} stopOpacity={1} />
          <Stop offset="0.46" stopColor="#9fd4ff" stopOpacity={1} />
          <Stop offset="0.82" stopColor="#2f6fe0" stopOpacity={1} />
          <Stop offset="1" stopColor="#2f6fe0" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={DOOR_W - 16} height={DOOR_H - 16} rx={6} fill="url(#doorGlow)" />
    </Svg>
  );
}
