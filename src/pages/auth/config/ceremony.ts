export const CONTRACT_PLATE = { slant: 6, dimTo: 0.65, enterRise: 12 } as const;

export const SIGNATURE = { maxSize: 40, minSize: 22, glyphEm: 0.7, sidePad: 8, nib: 28 } as const;

export const SEAL = { size: 14, core: 6, stampFrom: 1.6, rippleTo: 2.4 } as const;

export const DEAL = {
  gap: 28,
  blockHeight: 236,
  drop: 60,
  edgeOn: 90,
  tiltFrom: -12,
  tiltTo: 7,
  perspective: 800,
} as const;

export const CONTINUE_PROMPT = { breatheMs: 1400, dim: 0.45 } as const;
