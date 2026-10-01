export const MENU_ENTRY_HEIGHT = 72;
export const MENU_SKEW_DEG = 14;
export const MENU_ENTRY_SLIDE_RATIO = 0.6;
export const MENU_STAGGER_SPREAD = 0.5;
export const MENU_LABEL_PAD = 40;
export const SEALED_OPACITY = 0.6;

export const HIGHLIGHT_BAR = { top: 2, height: 68, width: '86%', bleed: 24, edge: 2 } as const;
export const HIGHLIGHT_SWEEP_START = 0.55;
export const HIGHLIGHT_MOVE_MS = 180;
export const SELECT_REDUCED_MS = 100;
export const SEALED_SHAKE = { distance: 8, stepMs: 60, repeats: 4 } as const;

export const LOCKUP = {
  labelTop: 4,
  labelLine: 44,
  labelScale: 1.25,
  subtitleTop: 48,
} as const;

export const WEDGE = {
  tipGap: 14,
  tipY: 40,
  lowerDeg: -8,
  upperDeg: -26,
  capY: 9,
  edge: 3,
} as const;
