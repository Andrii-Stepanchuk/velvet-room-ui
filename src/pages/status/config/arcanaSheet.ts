import { Easing } from 'react-native-reanimated';

export const ARCANA_SHEET = {
  heightRatio: 0.8,
  inMs: 320,
  outMs: 220,
  easingIn: Easing.out(Easing.cubic),
  easingOut: Easing.in(Easing.cubic),
} as const;
