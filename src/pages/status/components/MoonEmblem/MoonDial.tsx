import { memo } from 'react';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';

import { colors } from '@/constants/theme';
import type { MoonState } from '@/lib/game';
import { withAlpha } from '@/lib/style';
import { MOON_DIAL } from '../../config/statusLayout';
import { useMoonDial, type DialTone } from '../../hooks/useMoonDial';

const BEZEL = withAlpha(colors.background[700], 0.5);
const RIM = withAlpha(colors.accent, 0.25);
const HALO = withAlpha(colors.accent, 0.35);
const NEW_MARKER_STROKE = withAlpha(colors.accent, 0.55);

const TONE: Record<DialTone, string> = {
  lit: colors.accent,
  litEvent: colors.textPrimary,
  ahead: withAlpha(colors.accent, 0.22),
  aheadEvent: withAlpha(colors.accent, 0.45),
};

export const MoonDial = memo(function MoonDial({ size, moon }: { size: number; moon: MoonState }) {
  const dial = useMoonDial(size, moon);
  const { center, band, rim, ticks, today } = dial;

  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }}>
      <Circle cx={center} cy={center} r={band.radius} stroke={BEZEL} strokeWidth={band.width} fill="none" />
      <Circle cx={center} cy={center} r={rim} stroke={RIM} strokeWidth={1} fill="none" />
      {ticks.map((tick, i) => (
        <Line
          key={i}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke={TONE[tick.tone]}
          strokeWidth={MOON_DIAL.tickWidth}
          strokeLinecap="round"
        />
      ))}
      <Polygon points={dial.newMarker} fill={colors.background[700]} stroke={NEW_MARKER_STROKE} strokeWidth={1} />
      <Polygon points={dial.fullMarker} fill={colors.accent} />
      <Line {...today} stroke={HALO} strokeWidth={MOON_DIAL.haloWidth} strokeLinecap="round" />
      <Line {...today} stroke={colors.textPrimary} strokeWidth={MOON_DIAL.todayWidth} strokeLinecap="round" />
    </Svg>
  );
});
