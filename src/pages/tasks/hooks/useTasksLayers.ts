import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slideIn, staggered } from '@/lib/motion';
import { TASKS_SLIDE, TASKS_STAGGER } from '../config/tasksTiming';

const { layers, spread } = TASKS_STAGGER;

export function useTasksLayers(progress: SharedValue<number>) {
  const rail = useAnimatedStyle(() => slideIn(staggered(progress.value, 0, layers, spread), TASKS_SLIDE.rail, 0));
  const list = useAnimatedStyle(() => slideIn(staggered(progress.value, 1, layers, spread), 0, TASKS_SLIDE.list));
  const pinned = useAnimatedStyle(() => slideIn(staggered(progress.value, 2, layers, spread), 0, TASKS_SLIDE.pinned));
  return { rail, list, pinned };
}
