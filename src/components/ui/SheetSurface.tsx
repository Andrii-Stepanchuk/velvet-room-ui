import { memo } from 'react';
import Svg, { Defs, Line, LinearGradient, Polygon, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';

const EDGE = withAlpha(colors.accent, 0.4);
const SHARD = withAlpha(colors.textPrimary, 0.06);
const SHARD_LINE = withAlpha(colors.accent, 0.12);

export const SheetSurface = memo(function SheetSurface({
  width: w,
  height: h,
  rise,
  top,
  gradientId = 'sheetField',
}: {
  width: number;
  height: number;
  rise: number;
  top: number;
  gradientId?: string;
}) {
  const body = `0,0 ${w},${rise} ${w},${h} 0,${h}`;
  const shard = `${w * 0.3},${h} ${w},${h * 0.42} ${w},${h * 0.56} ${w * 0.55},${h}`;

  return (
    <Svg width={w} height={h} style={{ position: 'absolute', left: 0, top }} pointerEvents="none">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset={0} stopColor={colors.background[400]} />
          <Stop offset={0.55} stopColor={colors.background[400]} />
          <Stop offset={0.8} stopColor={colors.background[600]} />
          <Stop offset={1} stopColor={colors.background[700]} />
        </LinearGradient>
      </Defs>
      <Polygon points={body} fill={`url(#${gradientId})`} />
      <Polygon points={shard} fill={SHARD} />
      <Line x1={w * 0.18} y1={h} x2={w} y2={h * 0.3} stroke={SHARD_LINE} strokeWidth={1} />
      <Line x1={0} y1={0.5} x2={w} y2={rise + 0.5} stroke={EDGE} strokeWidth={1} />
    </Svg>
  );
});
