import { colors as rawColors, background, fonts as rawFonts } from './tokens.cjs';

export const colors = {
  ...rawColors,
  bg: background,
} as const;

export const fonts = rawFonts;
