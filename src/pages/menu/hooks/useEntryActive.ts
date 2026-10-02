import { useEffect, useState } from 'react';
import {
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ramp } from '@/lib/motion';
import { HIGHLIGHT_SWEEP_START, LOCKUP, SELECT_TIMING } from '../config/menuLayout';

export function useEntryActive(progress: SharedValue<number>, selected: boolean, shake: SharedValue<number>) {
  const reducedMotion = useReducedMotion();
  const active = useSharedValue(selected ? 1 : 0);
  const [wasSelected, setWasSelected] = useState(selected);
  const [lingering, setLingering] = useState(false);

  if (wasSelected !== selected) {
    setWasSelected(selected);
    setLingering(!selected);
  }

  useEffect(() => {
    active.value = withTiming(
      selected ? 1 : 0,
      { duration: reducedMotion ? SELECT_TIMING.reducedMs : SELECT_TIMING.ms, easing: SELECT_TIMING.easing },
      (finished) => {
        if (finished && !selected) scheduleOnRN(setLingering, false);
      },
    );
  }, [active, reducedMotion, selected]);

  const reveal = useDerivedValue(() => active.value * ramp(progress.value, HIGHLIGHT_SWEEP_START, 1));

  const idle = useAnimatedStyle(() => {
    const r = reveal.value;
    return { opacity: 1 - r, transform: [{ scale: reducedMotion ? 1 : 1 + r * (LOCKUP.labelScale - 1) }] };
  });

  const label = useAnimatedStyle(() => {
    const r = reveal.value;
    const scale = reducedMotion ? LOCKUP.labelScale : 1 + r * (LOCKUP.labelScale - 1);
    return { opacity: r, transform: [{ translateX: shake.value * active.value }, { scale }] };
  });

  const subtitle = useAnimatedStyle(() => {
    const r = reveal.value;
    const slide = reducedMotion ? 0 : (1 - r) * LOCKUP.subtitleSlide;
    return { opacity: r, transform: [{ translateX: slide + shake.value * active.value }] };
  });

  return { idle, label, subtitle, mounted: selected || lingering };
}
