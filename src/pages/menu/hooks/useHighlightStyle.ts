import { useWindowDimensions } from 'react-native';
import { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { HIGHLIGHT_SWEEP_START } from '../config/menuLayout';

export function useHighlightStyle(
  progress: SharedValue<number>,
  highlightY: SharedValue<number>,
  shake: SharedValue<number>,
) {
  const { width } = useWindowDimensions();
  return useAnimatedStyle(() => {
    const sweep = interpolate(progress.value, [HIGHLIGHT_SWEEP_START, 1], [0, 1], Extrapolation.CLAMP);
    return {
      opacity: sweep,
      transform: [{ translateX: (1 - sweep) * width + shake.value }, { translateY: highlightY.value }],
    };
  });
}
