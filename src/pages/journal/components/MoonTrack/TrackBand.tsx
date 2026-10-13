import { memo } from 'react';
import Svg, { Defs, Line, LinearGradient, Polygon, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { TRACK_BAND } from '../../config/trackLayout';
import { bandCenterY, type TrackGeometry } from '../../hooks/useTrackGeometry';

const BAND_LIGHT = '#14348f';
const BAND_DEEP = '#0c2678';
const EDGE_CYAN = withAlpha(colors.accent, 0.22);
const EDGE_FOAM = withAlpha(colors.textPrimary, 0.18);
const SHADOW_OFFSETS = [6, 4, 2] as const;

export const TrackBand = memo(function TrackBand({ g }: { g: TrackGeometry }) {
  const half = (TRACK_BAND.thickness * g.scale) / 2;
  const fall = TRACK_BAND.shadowDepth * g.scale;
  const left = bandCenterY(0, g);
  const right = bandCenterY(g.width, g);
  const band = `0,${left - half} ${g.width},${right - half} ${g.width},${right + half} 0,${left + half}`;
  const falloff = `0,${left + half} ${g.width},${right + half} ${g.width},${right + half + fall} 0,${left + half + fall}`;
  const tilt = (right - left) / g.width;
  const nx = -tilt / Math.hypot(1, tilt);
  const ny = 1 / Math.hypot(1, tilt);
  const midX = g.width / 2;
  const midY = bandCenterY(midX, g);

  return (
    <Svg width={g.width} height={g.height} pointerEvents="none">
      <Defs>
        <LinearGradient
          id="bandFill"
          x1={midX - nx * half}
          y1={midY - ny * half}
          x2={midX + nx * half}
          y2={midY + ny * half}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor={BAND_LIGHT} />
          <Stop offset={1} stopColor={BAND_DEEP} />
        </LinearGradient>
        <LinearGradient
          id="bandFall"
          x1={midX + nx * half}
          y1={midY + ny * half}
          x2={midX + nx * (half + fall)}
          y2={midY + ny * (half + fall)}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor={colors.background[900]} stopOpacity={TRACK_BAND.shadowOpacity} />
          <Stop offset={1} stopColor={colors.background[900]} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Polygon points={falloff} fill="url(#bandFall)" />
      {SHADOW_OFFSETS.map((dy) => (
        <Polygon key={dy} points={band} fill={colors.background[700]} fillOpacity={0.3} transform={`translate(0 ${dy})`} />
      ))}
      <Polygon points={band} fill="url(#bandFill)" />
      <Line x1={0} y1={left - half + 0.5} x2={g.width} y2={right - half + 0.5} stroke={EDGE_CYAN} strokeWidth={1} />
      <Line x1={0} y1={left - half + 1.5} x2={g.width} y2={right - half + 1.5} stroke={EDGE_FOAM} strokeWidth={1} />
    </Svg>
  );
});
