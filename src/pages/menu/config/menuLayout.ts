import { Easing } from 'react-native-reanimated';

export const MENU_ENTRY = { height: 72, labelPad: 40, sealedOpacity: 0.6 } as const;
export const MENU_ENTRY_SLIDE_RATIO = 0.6;
export const MENU_STAGGER_SPREAD = 0.5;

export const HIGHLIGHT_BAR = { top: 2, height: 68, width: '86%', bleed: 24, edge: 2, slant: 14 } as const;
export const HIGHLIGHT_SWEEP_START = 0.55;

export const LOCKUP = {
  labelTop: 4,
  labelLine: 44,
  labelScale: 1.25,
  subtitleTop: 48,
  subtitleSlide: 12,
} as const;

export const SELECT_TIMING = { ms: 180, reducedMs: 100, easing: Easing.out(Easing.cubic) } as const;
export const SEALED_SHAKE = { distance: 8, stepMs: 60, repeats: 4 } as const;
