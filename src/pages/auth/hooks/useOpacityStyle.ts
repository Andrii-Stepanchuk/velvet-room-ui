import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

export function useOpacityStyle(opacity: SharedValue<number>) {
  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}
