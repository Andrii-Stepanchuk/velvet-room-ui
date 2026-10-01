import type { ViewStyle } from 'react-native';
import type { useAnimatedStyle } from 'react-native-reanimated';

export type LayerStyle = ReturnType<typeof useAnimatedStyle<ViewStyle>>;

export function staggered(progress: number, index: number, count: number, spread: number): number {
  'worklet';
  const start = count > 1 ? (index / (count - 1)) * spread : 0;
  const t = (progress - start) / (1 - spread);
  return Math.min(Math.max(t, 0), 1);
}

export function slideIn(t: number, dx: number, dy: number): ViewStyle {
  'worklet';
  return { opacity: t, transform: [{ translateX: (1 - t) * dx }, { translateY: (1 - t) * dy }] };
}
