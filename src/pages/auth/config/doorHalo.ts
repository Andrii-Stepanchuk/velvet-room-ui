import { DOOR_H, DOOR_W } from './doorSize';

export const DOOR_HALO = {
  spread: 56,
  rings: 14,
  ringPeakOpacity: 0.55,
  frameRadius: 10,
  wash: { width: DOOR_W + 200, height: DOOR_H + 160, cy: '46%' },
  pulseMs: 2250,
  rest: 0.55,
  peak: 1,
  frameRest: 0.7,
  openSwell: 0.08,
  zoomFade: [1.15, 1.8],
} as const;
