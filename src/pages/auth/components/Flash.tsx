import { memo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';
import { useOpacityStyle } from '../hooks/useOpacityStyle';

const FLASH_MID = '#d3ecff';
const FLASH_EDGE = '#7db8ff';

export const Flash = memo(function Flash({ opacity }: { opacity: SharedValue<number> }) {
  const { width, height } = useWindowDimensions();
  const style = useOpacityStyle(opacity);
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="flash" cx="50%" cy="36%" rx="75%" ry="75%">
            <Stop offset="0" stopColor={colors.white} stopOpacity={1} />
            <Stop offset="0.52" stopColor={FLASH_MID} stopOpacity={1} />
            <Stop offset="1" stopColor={FLASH_EDGE} stopOpacity={1} />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#flash)" />
      </Svg>
    </Animated.View>
  );
});
