import { useWindowDimensions } from 'react-native';
import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slideIn, staggered } from '@/lib/motion';
import { MENU_ITEMS } from '../config/menuItems';
import { MENU_ENTRY_SLIDE_RATIO, MENU_STAGGER_SPREAD } from '../config/menuLayout';

export function useMenuEntryStyle(progress: SharedValue<number>, index: number) {
  const { width } = useWindowDimensions();
  const distance = width * MENU_ENTRY_SLIDE_RATIO;
  return useAnimatedStyle(() =>
    slideIn(staggered(progress.value, index, MENU_ITEMS.length, MENU_STAGGER_SPREAD), distance, 0),
  );
}
