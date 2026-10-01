import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slideIn, staggered } from '@/lib/motion';
import { STATUS_SLIDE, STATUS_STAGGER } from '../config/statusTiming';

const { layers, spread } = STATUS_STAGGER;

export function useStatusLayers(progress: SharedValue<number>) {
  const header = useAnimatedStyle(() => slideIn(staggered(progress.value, 0, layers, spread), STATUS_SLIDE.header, 0));
  const menuButton = useAnimatedStyle(() =>
    slideIn(staggered(progress.value, 0, layers, spread), STATUS_SLIDE.menuButton, 0),
  );
  const identity = useAnimatedStyle(() => slideIn(staggered(progress.value, 1, layers, spread), 0, STATUS_SLIDE.near));
  const xp = useAnimatedStyle(() => slideIn(staggered(progress.value, 2, layers, spread), 0, STATUS_SLIDE.near));
  const stats = useAnimatedStyle(() => slideIn(staggered(progress.value, 3, layers, spread), 0, STATUS_SLIDE.far));
  const quests = useAnimatedStyle(() => slideIn(staggered(progress.value, 4, layers, spread), 0, STATUS_SLIDE.far));
  return { header, menuButton, identity, xp, stats, quests };
}
