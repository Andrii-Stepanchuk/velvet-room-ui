import { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slideIn } from '@/lib/motion';

export function useMenuLayers(progress: SharedValue<number>) {
  const title = useAnimatedStyle(() =>
    slideIn(interpolate(progress.value, [0, 0.5], [0, 1], Extrapolation.CLAMP), -40, 0),
  );
  const moon = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.4], [0, 1], Extrapolation.CLAMP),
  }));
  const back = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.6, 1], [0, 1], Extrapolation.CLAMP),
  }));
  return { title, moon, back };
}
