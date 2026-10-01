import { Easing } from 'react-native-reanimated';

export const SCREEN_TIMING = { enter: 420, exit: 260, reduced: 150 } as const;
export const DARK_HOUR_VEIL_MS = 1500;
export const ENTER_EASING = Easing.out(Easing.cubic);
export const EXIT_EASING = Easing.in(Easing.cubic);
export const PAGE_HEADER_MOTION = {
  tabSlide: 40,
  titleSlide: -40,
  tabs: [0, 0.5],
  title: [0.1, 0.6],
  caption: [0.2, 0.6],
} as const;
