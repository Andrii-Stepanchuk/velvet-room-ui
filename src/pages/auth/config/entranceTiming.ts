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
  ceremonyFlashOut: 900,
  skipFlashIn: 250,
  noClipHold: 650,
  clipStartTimeout: 2500,
  clipMaxRuntime: 12000,
} as const;

export const DOOR_EASING = Easing.bezier(0.65, 0, 0.7, 0.25);
export const CAMERA_EASING = Easing.bezier(0.6, 0.05, 0.9, 0.4);

export const CEREMONY_MS = {
  plateIn: 500,
  writeLead: 300,
  writePerLetter: 90,
  writeMin: 600,
  writeMax: 1400,
  seal: 500,
  deal: 800,
  promptDelay: 300,
  settle: 180,
  exit: 450,
  reducedFade: 500,
} as const;

export const SEAL_EASING = Easing.bezier(0.16, 1, 0.3, 1);
export const DEAL_EASING = Easing.bezier(0.16, 1, 0.3, 1);
