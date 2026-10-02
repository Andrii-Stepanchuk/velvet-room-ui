import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slideIn, staggered } from '@/lib/motion';
import { DETAIL_STAGGER } from '../config/statDetailTiming';

export function useDetailLayer(progress: SharedValue<number>, index: number, dx: number, dy: number) {
  return useAnimatedStyle(() =>
    slideIn(staggered(progress.value, index, DETAIL_STAGGER.layers, DETAIL_STAGGER.spread), dx, dy),
  );
}
