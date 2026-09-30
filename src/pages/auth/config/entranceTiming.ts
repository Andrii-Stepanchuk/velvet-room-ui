import { Easing } from 'react-native-reanimated';

export const TIMING_MS = {
  doorOpen: 1200,
  camera: 1900,
  glow: 900,
  formFade: 500,
  flashIn: 450,
  flashPeakHold: 120,
  flashOut: 520,
  outroLeadBeforeClipEnd: 420,
  outroFlashIn: 420,
  welcomeFade: 900,
  welcomeHold: 2200,
  skipFlashIn: 250,
  noClipHold: 650,
  clipStartTimeout: 2500,
  clipMaxRuntime: 12000,
} as const;

export const DOOR_EASING = Easing.bezier(0.65, 0, 0.7, 0.25);
export const CAMERA_EASING = Easing.bezier(0.6, 0.05, 0.9, 0.4);
