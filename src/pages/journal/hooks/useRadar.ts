import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { ramp } from '@/lib/motion';
import { MOON_GLOW, RADAR } from '../config/trackLayout';
import { RADAR_TIMING } from '../config/journalTiming';

function emitted(t: number): number {
  'worklet';
  return t > 0 && t < MOON_GLOW.window ? 1 - t / MOON_GLOW.window : 0;
}

export function useRadar(selected: string, moving: SharedValue<number>, progress: SharedValue<number>) {
  const focused = useIsFocused();
  const reducedMotion = useReducedMotion();
  const first = useSharedValue(0);
  const second = useSharedValue(0);
  const looping = focused && !reducedMotion;

  useEffect(() => {
    const waves = [first, second];
    for (const wave of waves) {
      cancelAnimation(wave);
      wave.value = 0;
    }
    if (!looping) return;
    waves.forEach((wave, k) => {
      wave.value = withDelay(
        RADAR_TIMING.startMs + (k * RADAR_TIMING.periodMs) / RADAR.waves,
        withRepeat(withTiming(1, { duration: RADAR_TIMING.periodMs, easing: Easing.linear }), -1, false),
      );
    });
    return () => waves.forEach((wave) => cancelAnimation(wave));
  }, [looping, selected, first, second]);

  const field = useAnimatedStyle(() => ({
    opacity: ramp(progress.value, RADAR_TIMING.reveal[0], RADAR_TIMING.reveal[1]) * (1 - moving.value),
  }));

  const glow = useAnimatedStyle(() => {
    if (!looping) return { opacity: MOON_GLOW.rest / MOON_GLOW.swell };
    const e = Math.max(emitted(first.value), emitted(second.value));
    return { opacity: (MOON_GLOW.rest + (MOON_GLOW.swell - MOON_GLOW.rest) * e) / MOON_GLOW.swell };
  });

  return { field, glow, waves: [first, second] as const, looping };
}

export function useRadarWave(wave: SharedValue<number>, index: number, looping: boolean, scale: number) {
  return useAnimatedProps(() => {
    const span = (RADAR.to - RADAR.from) * scale;
    if (!looping) {
      return {
        r: RADAR.from * scale + span * RADAR.still[index],
        strokeWidth: 1,
        strokeOpacity: RADAR.stillOpacity[index],
      };
    }
    const t = wave.value;
    const eased = 1 - (1 - t) * (1 - t) * (1 - t);
    return {
      r: RADAR.from * scale + span * eased,
      strokeWidth: RADAR.strokeFrom + (RADAR.strokeTo - RADAR.strokeFrom) * t,
      strokeOpacity: RADAR.peak * Math.min(t / RADAR.fadeIn, 1) * (1 - t) * (1 - t),
    };
  });
}
