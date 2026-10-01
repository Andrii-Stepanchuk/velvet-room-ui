import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/constants/theme';
import type { LayerStyle } from '@/lib/motion';
import { BOOST_FX } from '../../config/boostFx';

export const DialSweep = memo(function DialSweep({
  size,
  radius,
  width,
  style,
}: {
  size: number;
  radius: number;
  width: number;
  style: LayerStyle;
}) {
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const arc = circumference * BOOST_FX.sweepArc;
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.textPrimary}
          strokeWidth={width}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${arc} ${circumference}`}
          transform={`rotate(${-BOOST_FX.sweepArc * 180} ${center} ${center})`}
        />
      </Svg>
    </Animated.View>
  );
});
