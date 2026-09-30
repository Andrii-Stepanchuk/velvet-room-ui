import { useEffect } from 'react';
import { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

export function useDrift(amount: number, duration: number, delay = 0) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [t, amount, duration, delay]);
  return useAnimatedStyle(() => ({ transform: [{ translateX: (t.value * 2 - 1) * amount }] }));
}
