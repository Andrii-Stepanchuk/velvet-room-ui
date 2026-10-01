import { Easing } from 'react-native-reanimated';

export const SCREEN_TIMING = { enter: 420, exit: 260, reduced: 150 } as const;
export const ENTER_EASING = Easing.out(Easing.cubic);
export const EXIT_EASING = Easing.in(Easing.cubic);
