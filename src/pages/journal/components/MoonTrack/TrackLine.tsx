import { memo } from 'react';
import Svg, { Defs, Line, LinearGradient, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';
import type { TrackGeometry } from '../../hooks/useTrackGeometry';

export const TrackLine = memo(function TrackLine({ g }: { g: TrackGeometry }) {
  const down = (g.height - g.fy) / g.sin;
  const up = g.fy / g.sin;
  const x1 = g.fx - g.cos * down;
  const x2 = g.fx + g.cos * up;
  return (
    <Svg width={g.width} height={g.height} pointerEvents="none" style={{ position: 'absolute' }}>
      <Defs>
        <LinearGradient id="trackLine" x1={x1} y1={g.height} x2={x2} y2={0} gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor={colors.textPrimary} stopOpacity={0} />
          <Stop offset={0.25} stopColor={colors.textPrimary} stopOpacity={0.55} />
          <Stop offset={0.8} stopColor={colors.textPrimary} stopOpacity={0.55} />
          <Stop offset={1} stopColor={colors.textPrimary} stopOpacity={0.12} />
        </LinearGradient>
      </Defs>
      <Line x1={x1} y1={g.height} x2={x2} y2={0} stroke="url(#trackLine)" strokeWidth={1.5} />
    </Svg>
  );
});
