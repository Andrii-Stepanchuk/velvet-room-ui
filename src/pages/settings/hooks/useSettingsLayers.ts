import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slideIn, staggered } from '@/lib/motion';
import { SETTINGS_SLIDE, SETTINGS_STAGGER } from '../config/settingsTiming';

const { layers, spread } = SETTINGS_STAGGER;

export function useSettingsLayers(progress: SharedValue<number>) {
  const profile = useAnimatedStyle(() => slideIn(staggered(progress.value, 1, layers, spread), 0, SETTINGS_SLIDE.section));
  const boosts = useAnimatedStyle(() => slideIn(staggered(progress.value, 2, layers, spread), 0, SETTINGS_SLIDE.section));
  const entrance = useAnimatedStyle(() =>
    slideIn(staggered(progress.value, 3, layers, spread), 0, SETTINGS_SLIDE.section),
  );
  return { profile, boosts, entrance };
}
