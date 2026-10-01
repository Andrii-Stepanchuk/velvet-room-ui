import { PixelRatio, type TextStyle, type ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

export function glowShadow(
  color: string,
  { opacity, radius, elevation, offsetY = 0 }: { opacity: number; radius: number; elevation: number; offsetY?: number },
): ViewStyle {
  return {
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: offsetY },
    elevation,
  };
}

export const textGlow: TextStyle = {
  textShadowColor: withAlpha(colors.glow[400], 0.6),
  textShadowRadius: 8,
};

export const pixelAlignedBorderWidth = PixelRatio.roundToNearestPixel(1);

export function skewX(deg: number): ViewStyle {
  return { transform: [{ skewX: `${deg}deg` }] };
}
