import { useWindowDimensions } from 'react-native';
import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { ramp } from '@/lib/motion';
import { HIGHLIGHT_SWEEP_START } from '../config/menuLayout';

export function useHighlightStyle(
  progress: SharedValue<number>,
  highlightY: SharedValue<number>,
  shake: SharedValue<number>,
) {
  const { width } = useWindowDimensions();
  return useAnimatedStyle(() => {
    const sweep = ramp(progress.value, HIGHLIGHT_SWEEP_START, 1);
    return {
      opacity: sweep,
      transform: [{ translateX: (1 - sweep) * width + shake.value }, { translateY: highlightY.value }],
    };
  });
}
