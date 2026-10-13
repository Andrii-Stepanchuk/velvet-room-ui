import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ENTER_EASING, EXIT_EASING, SCREEN_TIMING } from '@/constants/motion';
import type { DayKey } from '@/lib/game';
import { slideIn, staggered } from '@/lib/motion';
import { DAY_SWAP } from '../config/journalTiming';

export function useDaySwap(selected: DayKey) {
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(selected);
  const deal = useSharedValue(0);
  const mounted = useRef(false);

  const dealIn = useCallback(() => {
    deal.value = withTiming(1, { duration: reducedMotion ? DAY_SWAP.reducedMs : DAY_SWAP.inMs, easing: ENTER_EASING });
  }, [deal, reducedMotion]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      deal.value = withDelay(SCREEN_TIMING.enter / 3, withTiming(1, { duration: DAY_SWAP.inMs, easing: ENTER_EASING }));
      return;
    }
    if (selected === shown) {
      dealIn();
      return;
    }
    deal.value = withTiming(
      0,
      { duration: reducedMotion ? DAY_SWAP.reducedMs : DAY_SWAP.outMs, easing: EXIT_EASING },
      (finished) => {
        if (finished) scheduleOnRN(setShown, selected);
      },
    );
  }, [selected, shown, deal, dealIn, reducedMotion]);

  return { shown, deal };
}

export function useDealtRow(deal: SharedValue<number>, index: number, count: number) {
  const reducedMotion = useReducedMotion();
  return useAnimatedStyle(() => {
    if (reducedMotion) return { opacity: deal.value };
    const slots = Math.min(count, DAY_SWAP.maxStagger) + 1;
    const t = staggered(deal.value, Math.min(index, DAY_SWAP.maxStagger), slots, DAY_SWAP.spread);
    return slideIn(t, 0, DAY_SWAP.rise);
  });
}
