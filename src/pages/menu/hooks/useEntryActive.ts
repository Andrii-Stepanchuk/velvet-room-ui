import { useEffect } from 'react';
import {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { HIGHLIGHT_MOVE_MS, HIGHLIGHT_SWEEP_START, LOCKUP, SELECT_REDUCED_MS } from '../config/menuLayout';

const SUBTITLE_SLIDE = 12;

export function useEntryActive(progress: SharedValue<number>, selected: boolean, shake: SharedValue<number>) {
  const reducedMotion = useReducedMotion();
  const active = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    active.value = withTiming(selected ? 1 : 0, {
      duration: reducedMotion ? SELECT_REDUCED_MS : HIGHLIGHT_MOVE_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [active, reducedMotion, selected]);

  const reveal = useDerivedValue(
    () => active.value * interpolate(progress.value, [HIGHLIGHT_SWEEP_START, 1], [0, 1], Extrapolation.CLAMP),
  );

  const idle = useAnimatedStyle(() => {
    const r = reveal.value;
    return { opacity: 1 - r, transform: [{ scale: reducedMotion ? 1 : 1 + r * (LOCKUP.labelScale - 1) }] };
  });

  const group = useAnimatedStyle(() => {
    const r = reveal.value;
    const scale = reducedMotion ? LOCKUP.labelScale : 1 + r * (LOCKUP.labelScale - 1);
    return { opacity: r, transform: [{ translateX: shake.value * active.value }, { scale }] };
  });

  const subtitle = useAnimatedStyle(() => {
    const r = reveal.value;
    const slide = reducedMotion ? 0 : (1 - r) * SUBTITLE_SLIDE;
    return { opacity: r, transform: [{ translateX: slide + shake.value * active.value }] };
  });

  return { idle, group, subtitle };
}
