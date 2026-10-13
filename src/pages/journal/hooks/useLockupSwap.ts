import { useEffect, useRef } from 'react';
import { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { ENTER_EASING } from '@/constants/motion';
import { LOCKUP_SWAP } from '../config/journalTiming';

export function useLockupSwap(month: string) {
  const reducedMotion = useReducedMotion();
  const t = useSharedValue(1);
  const direction = useSharedValue(1);
  const previous = useRef(month);

  useEffect(() => {
    if (previous.current === month) return;
    direction.value = month < previous.current ? -1 : 1;
    previous.current = month;
    if (reducedMotion) return;
    t.value = 0;
    t.value = withTiming(1, { duration: LOCKUP_SWAP.ms, easing: ENTER_EASING });
  }, [month, reducedMotion, t, direction]);

  return useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ translateX: (1 - t.value) * LOCKUP_SWAP.shift * direction.value }],
  }));
}
