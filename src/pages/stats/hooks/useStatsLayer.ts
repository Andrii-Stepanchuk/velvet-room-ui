import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slideIn, staggered } from '@/lib/motion';
import { STATS_SLIDE, STATS_STAGGER } from '../config/statsTiming';

export function useStatsLayer(progress: SharedValue<number>, index: number) {
  return useAnimatedStyle(() =>
    slideIn(staggered(progress.value, index, STATS_STAGGER.layers, STATS_STAGGER.spread), STATS_SLIDE.plate, 0),
  );
}
