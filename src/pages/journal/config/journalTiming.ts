import { Easing } from 'react-native-reanimated';

export const JOURNAL_STAGGER = { layers: 4, spread: 0.4 } as const;
export const JOURNAL_SLIDE = { band: -40, lockup: -40, nodes: 48, log: 30 } as const;
export const NODE_CASCADE = { start: 0.1, spread: 0.35, length: 0.5 } as const;

export const TRACK_GLIDE = { damping: 26, stiffness: 210, mass: 1, fling: 0.12, rubber: 0.3 } as const;
export const TRACK_JUMP = { fadeMs: 140, inMs: 260, nearDays: 4, glideMs: 520 } as const;

export const RADAR_TIMING = { periodMs: 7200, fadeMs: 260, startMs: 120, reveal: [0.75, 1] } as const;

export const DAY_SWAP = { outMs: 160, inMs: 460, drop: 10, rise: 16, maxStagger: 7, spread: 0.45, reducedMs: 150 } as const;

export const LOCKUP_SWAP = { ms: 320, shift: 12 } as const;

export const MONTH_SHEET_TIMING = {
  inMs: 380,
  outMs: 240,
  reducedMs: 150,
  easingIn: Easing.out(Easing.cubic),
  easingOut: Easing.in(Easing.cubic),
} as const;
