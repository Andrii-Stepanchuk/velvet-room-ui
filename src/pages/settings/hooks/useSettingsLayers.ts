import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slideIn, staggered } from '@/lib/motion';
import { SETTINGS_SLIDE, SETTINGS_STAGGER } from '../config/settingsTiming';

const { layers, spread } = SETTINGS_STAGGER;

export function useSettingsLayers(progress: SharedValue<number>) {
  const player = useAnimatedStyle(() =>
    slideIn(staggered(progress.value, 0, layers, spread), 0, SETTINGS_SLIDE.section),
  );
  const boosts = useAnimatedStyle(() =>
    slideIn(staggered(progress.value, 1, layers, spread), 0, SETTINGS_SLIDE.section),
  );
  const rest = useAnimatedStyle(() => slideIn(staggered(progress.value, 2, layers, spread), 0, SETTINGS_SLIDE.section));
  return { player, boosts, rest };
}
