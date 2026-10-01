import { colors as rawColors, background, glow, stat, radius as rawRadius } from './tokens.cjs';

export const colors = {
  ...rawColors,
  background,
  glow,
  stat,
} as const;

export const radius = rawRadius;
