import { memo } from 'react';
import Svg, { Defs, Ellipse, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';
import { DOOR_HALO } from '../../config/doorHalo';
import { DOOR_H, DOOR_W } from '../../config/doorSize';

const { spread, rings, ringPeakOpacity, frameRadius, wash } = DOOR_HALO;
const HALO_W = wash.width;
const HALO_H = wash.height;
const PAD_X = (HALO_W - DOOR_W) / 2;
const PAD_Y = (HALO_H - DOOR_H) / 2;
const STEP = spread / rings;
const RINGS = Array.from({ length: rings }, (_, i) => {
  const d = (i + 0.5) * STEP;
  const falloff = 1 - (i + 0.5) / rings;
  return { d, opacity: ringPeakOpacity * falloff * falloff };
});

export const DoorHalo = memo(function DoorHalo() {
  return (
    <Svg width={HALO_W} height={HALO_H}>
      <Defs>
        <RadialGradient id="doorHaloWash" cx="50%" cy={wash.cy} rx="50%" ry="50%">
          <Stop offset="0" stopColor={colors.glow[300]} stopOpacity={0.6} />
          <Stop offset="0.55" stopColor={colors.glow[500]} stopOpacity={0.4} />
          <Stop offset="1" stopColor={colors.glow[500]} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={HALO_W / 2} cy={HALO_H / 2} rx={HALO_W / 2} ry={HALO_H / 2} fill="url(#doorHaloWash)" />
      {RINGS.map(({ d, opacity }) => (
        <Rect
          key={d}
          x={PAD_X - d}
          y={PAD_Y - d}
          width={DOOR_W + d * 2}
          height={DOOR_H + d * 2}
          rx={frameRadius + d}
          fill="none"
          stroke={colors.accent}
          strokeOpacity={opacity}
          strokeWidth={STEP}
        />
      ))}
    </Svg>
  );
});
