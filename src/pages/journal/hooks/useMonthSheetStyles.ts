import { useWindowDimensions } from 'react-native';
import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slantOffset } from '@/lib/style';
import { MONTH_SHEET } from '../config/monthSheetLayout';

export function useMonthSheetStyles(progress: SharedValue<number>) {
  const { width, height: screenHeight } = useWindowDimensions();
  const height = Math.round(Math.max(screenHeight * MONTH_SHEET.heightRatio, Math.min(MONTH_SHEET.minHeight, screenHeight * 0.9)));
  const rise = slantOffset(width, MONTH_SHEET.topSlant);
  const travel = height + MONTH_SHEET.lift;
  const backdrop = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - progress.value) * travel }] }));
  return { width, height, rise, backdrop, sheet };
}
