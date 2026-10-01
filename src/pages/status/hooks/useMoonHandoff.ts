import { useCallback } from 'react';
import { useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HEADER_TOP, MENU_MOON_SIZE, PAGE_PADDING_X } from '@/constants/layout';
import { MOON_DISC_RATIO } from '../config/statusLayout';

export function useMoonHandoff(progress: SharedValue<number>, moonSize: number) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const targetX = width - PAGE_PADDING_X - MENU_MOON_SIZE / 2;
  const targetY = insets.top + HEADER_TOP + MENU_MOON_SIZE / 2;
  const endScale = MENU_MOON_SIZE / (moonSize * MOON_DISC_RATIO);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { x, y, width: w, height: h } = e.nativeEvent.layout;
      offsetX.value = targetX - (x + w / 2);
      offsetY.value = targetY - (y + h / 2);
    },
    [offsetX, offsetY, targetX, targetY],
  );

  const style = useAnimatedStyle(() => {
    const away = 1 - progress.value;
    return {
      opacity: interpolate(progress.value, [0, 0.2], [0, 1], Extrapolation.CLAMP),
      transform: [
        { translateX: away * offsetX.value },
        { translateY: away * offsetY.value },
        { scale: 1 + away * (endScale - 1) },
      ],
    };
  });

  return { onLayout, style };
}
