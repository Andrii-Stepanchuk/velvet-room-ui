export const TRACK = {
  heightRatio: 0.4,
  minHeight: 290,
  maxHeight: 360,
  refWidth: 412,
  refHeight: 340,
  focusX: 0.56,
  focusY: 0.56,
  angle: 48,
  near: 70,
  step: 56,
  pastWindow: 5,
  futureWindow: 4,
  tapReach: 84,
} as const;

export const TRACK_NODE = {
  moon: 52,
  ring: 62,
  ringWidth: 2,
  boxWidth: 210,
  boxHeight: 68,
  labelGap: 12,
  numeral: 44,
  numeralLine: 46,
  sizes: [1, 34 / 52, 30 / 52, 28 / 52],
  numeralScale: [1, 0.6, 0.54, 0.5],
  dim: [1, 0.9, 0.62],
  dimAt: [0, 1.6, 3],
  edgeAt: [3, 3.6],
  futureOpacity: 0.45,
  marker: 8,
  rimWidth: 1.5,
  rimAlpha: 0.28,
  maxFontScale: 1,
} as const;

export const TRACK_BAND = {
  slant: 16,
  thickness: 78,
  lift: 52,
  shadowDepth: 22,
  shadowOpacity: 0.45,
} as const;

export const LOCKUP = { centerX: 0.27, maxFontScale: 1.1 } as const;

export const RADAR = {
  waves: 2,
  from: 31,
  to: 84,
  strokeFrom: 1.5,
  strokeTo: 0.75,
  peak: 0.6,
  fadeIn: 0.08,
  still: [0.45, 0.85],
  stillOpacity: [0.28, 0.16],
  pad: 4,
} as const;

export const MOON_GLOW = { size: 150, rest: 0.26, swell: 0.38, window: 0.25 } as const;
