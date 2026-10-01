import { memo } from 'react';
import { View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { ARCANA_PIP_SPACING } from '../../config/arcanaSheet';

const S = ARCANA_PIP_SPACING;
const R = S * 0.4;
const DIM = withAlpha(colors.ink, 0.32);

function pip(i: number): string {
  const cx = i * S + S / 2;
  const cy = S / 2;
  return `${cx},${cy - R} ${cx + R},${cy} ${cx},${cy + R} ${cx - R},${cy}`;
}

export const ArcanaPips = memo(function ArcanaPips({
  index,
  count,
  className,
}: {
  index: number;
  count: number;
  className?: string;
}) {
  return (
    <View importantForAccessibility="no-hide-descendants" className={className} style={{ aspectRatio: count }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${count * S} ${S}`}>
        {Array.from({ length: count }, (_, i) =>
          i === index ? (
            <Polygon key={i} points={pip(i)} fill={colors.ink} />
          ) : (
            <Polygon key={i} points={pip(i)} fill="none" stroke={DIM} strokeWidth={1} />
          ),
        )}
      </Svg>
    </View>
  );
});
