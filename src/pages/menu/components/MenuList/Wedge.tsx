import { memo } from 'react';
import Svg, { Polygon } from 'react-native-svg';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { WEDGE } from '../../config/menuLayout';
import type { LockupGeometry } from '../../hooks/useLockupGeometry';

const HEIGHT = WEDGE.tipY - WEDGE.capY + WEDGE.edge + 2;
const ECHO = withAlpha(colors.accent, 0.35);

export const Wedge = memo(function Wedge({ geometry }: { geometry: LockupGeometry }) {
  return (
    <Svg
      pointerEvents="none"
      width={geometry.wedgeWidth}
      height={HEIGHT}
      style={{ position: 'absolute', left: 0, top: WEDGE.capY }}
    >
      <Polygon points={geometry.wedgePoints} fill={ECHO} translateY={WEDGE.edge} />
      <Polygon points={geometry.wedgePoints} fill={colors.accent} />
    </Svg>
  );
});
