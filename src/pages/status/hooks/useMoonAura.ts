import { useCallback, useEffect } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { ENTER_EASING, SCREEN_TIMING } from '@/constants/motion';
import type { Boosts } from '@/lib/game';
import { BOOST_FX } from '../config/boostFx';

const REST = 0.5;
const SWEEP_TO = 270;
const [BREATH_LOW, BREATH_HIGH] = BOOST_FX.breathOpacity;

export function moonAuraIntensity(boosts: Boosts): number {
  if (boosts.fullMoon) return 1;
  return boosts.darkHour ? BOOST_FX.darkHourIntensity : 0;
}

export function useMoonAura(progress: SharedValue<number>, boosts: Boosts, sweepFrom: number) {
  const reducedMotion = useReducedMotion();
  const focused = useIsFocused();
  const breath = useSharedValue(REST);
  const sweep = useSharedValue(0);
  const intensity = moonAuraIntensity(boosts);
  const breathing = intensity > 0 && focused && !reducedMotion;
  const sweeping = boosts.fullMoon && !reducedMotion;

  useEffect(() => {
    if (!breathing) {
      cancelAnimation(breath);
      breath.value = REST;
      return;
    }
    breath.value = 0;
    breath.value = withRepeat(withTiming(1, { duration: BOOST_FX.breathMs, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(breath);
  }, [breathing, breath]);

  useFocusEffect(
    useCallback(() => {
      sweep.value = 0;
      if (!sweeping) return;
      sweep.value = withDelay(SCREEN_TIMING.enter, withTiming(1, { duration: BOOST_FX.sweepMs, easing: ENTER_EASING }));
      return () => cancelAnimation(sweep);
    }, [sweeping, sweep]),
  );

  const corona = useAnimatedStyle(() => {
    const arrived = interpolate(progress.value, [0.4, 1], [0, 1], Extrapolation.CLAMP);
    const glow = BREATH_LOW + (BREATH_HIGH - BREATH_LOW) * breath.value;
    return {
      opacity: intensity * glow * arrived,
      transform: [{ scale: 1 + (breath.value - REST) * 2 * BOOST_FX.breathScale }],
    };
  });

  const sweepStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sweep.value, [0, 0.15, 0.75, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
    transform: [{ rotate: `${sweepFrom + sweep.value * (SWEEP_TO - sweepFrom)}deg` }],
  }));

  return { intensity, corona, sweep: sweepStyle };
}
