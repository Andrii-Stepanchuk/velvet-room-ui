import { useWindowDimensions } from 'react-native';
import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slantOffset } from '@/lib/style';
import { FORGE } from '../config/tasksLayout';

export function useForgeSheetStyles(progress: SharedValue<number>) {
  const { width, height: screenHeight } = useWindowDimensions();
  const height = Math.round(screenHeight * FORGE.heightRatio);
  const rise = slantOffset(width, FORGE.topSlant);
  const travel = height + FORGE.lift;
  const keyboardOffset = screenHeight - travel;
  const backdrop = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - progress.value) * travel }] }));
  return { width, height, rise, keyboardOffset, backdrop, sheet };
}
