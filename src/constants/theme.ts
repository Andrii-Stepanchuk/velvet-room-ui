import { colors as rawColors, background, glow, radius as rawRadius } from './tokens.cjs';

export const colors = {
  ...rawColors,
  background,
  glow,
} as const;

export const radius = rawRadius;
