import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { DARK_HOUR_VEIL_MS, SCREEN_TIMING } from '@/constants/motion';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { SoftGlow } from '../SoftGlow';

const VEIL_COLORS = [
  withAlpha(colors.background[900], 0.8),
  withAlpha(colors.background[800], 0.6),
  withAlpha(colors.background[900], 0.35),
] as const;
const VEIL_LOCATIONS = [0, 0.45, 1] as const;

export const DarkHourVeil = memo(function DarkHourVeil({
  active,
  width,
  height,
}: {
  active: boolean;
  width: number;
  height: number;
}) {
  const reducedMotion = useReducedMotion();
  const shown = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    shown.value = withTiming(active ? 1 : 0, { duration: reducedMotion ? SCREEN_TIMING.reduced : DARK_HOUR_VEIL_MS });
  }, [active, reducedMotion, shown]);

  const style = useAnimatedStyle(() => ({ opacity: shown.value }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <LinearGradient colors={VEIL_COLORS} locations={VEIL_LOCATIONS} style={StyleSheet.absoluteFill} />
      <View style={{ position: 'absolute', top: -height * 0.08, left: width * 0.1 }}>
        <SoftGlow width={width * 0.8} height={height * 0.3} color={colors.glow[300]} opacity={0.14} />
      </View>
    </Animated.View>
  );
});
