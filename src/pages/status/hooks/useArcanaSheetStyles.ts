import { useWindowDimensions } from 'react-native';
import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { ARCANA_SHEET } from '../config/arcanaSheet';

export function useArcanaSheetStyles(progress: SharedValue<number>) {
  const { height: screenHeight } = useWindowDimensions();
  const height = Math.round(screenHeight * ARCANA_SHEET.heightRatio);
  const backdrop = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - progress.value) * height }] }));
  return { backdrop, sheet, height };
}
