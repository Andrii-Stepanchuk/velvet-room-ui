import { Easing } from 'react-native-reanimated';

export const TASKS_STAGGER = { layers: 3, spread: 0.4 } as const;
export const TASKS_SLIDE = { rail: -40, list: 30, pinned: 40 } as const;

export const FORGE_SHEET = {
  inMs: 380,
  outMs: 240,
  reducedMs: 150,
  easingIn: Easing.out(Easing.cubic),
  easingOut: Easing.in(Easing.cubic),
} as const;

export const XP_READOUT = { inMs: 220, holdMs: 700, outMs: 360, rise: 10, reducedMs: 150 } as const;

export const RANK_UP_TIMING = { inMs: 360, holdMs: 1500, outMs: 320, reducedMs: 150 } as const;
