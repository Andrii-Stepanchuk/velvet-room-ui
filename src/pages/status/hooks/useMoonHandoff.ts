import { useCallback, useEffect } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';

import { EDGE_TAB_HEIGHT, HEADER_MOON_SIZE } from '@/constants/layout';
import { useHeaderMoon } from '@/lib/state/headerMoon';
import { MOON_DISC_RATIO } from '../config/statusLayout';
import { MOON_HANDOFF } from '../config/statusTiming';

const TARGET_Y = EDGE_TAB_HEIGHT / 2;

export function useMoonHandoff(progress: SharedValue<number>, moonSize: number) {
  const headerCenterX = useHeaderMoon((state) => state.centerX);
  const anchorX = useSharedValue(-1);
  const tabsLeft = useSharedValue(0);
  const tabsRight = useSharedValue(0);
  const moonX = useSharedValue(0);
  const moonY = useSharedValue(0);
  const endScale = HEADER_MOON_SIZE / (moonSize * MOON_DISC_RATIO);

  useEffect(() => {
    anchorX.value = headerCenterX ?? -1;
  }, [anchorX, headerCenterX]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { x, y, width, height } = e.nativeEvent.layout;
      moonX.value = x + width / 2;
      moonY.value = y + height / 2;
    },
    [moonX, moonY],
  );

  const onDateTabLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      tabsLeft.value = x + width;
    },
    [tabsLeft],
  );

  const onMenuButtonLayout = useCallback(
    (e: LayoutChangeEvent) => {
      tabsRight.value = e.nativeEvent.layout.x;
    },
    [tabsRight],
  );

  const style = useAnimatedStyle(() => {
    const away = 1 - progress.value;
    const targetX = anchorX.value >= 0 ? anchorX.value : (tabsLeft.value + tabsRight.value) / 2;
    return {
      transform: [
        { translateX: away * (targetX - moonX.value) },
        { translateY: away * (TARGET_Y - moonY.value) },
        { scale: 1 + away * (endScale - 1) },
      ],
    };
  });

  const dialStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, MOON_HANDOFF.dialFade, [0, 1], Extrapolation.CLAMP),
  }));

  return { onLayout, onDateTabLayout, onMenuButtonLayout, style, dialStyle };
}
