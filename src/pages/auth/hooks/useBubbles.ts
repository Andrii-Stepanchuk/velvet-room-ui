import type { GestureResponderEvent } from 'react-native';
import {
  interpolate,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';

export interface AmbientSpec {
  id: number;
  leftFraction: number;
  sizePx: number;
  riseMs: number;
  delayMs: number;
  swayHalfPeriodMs: number;
}

interface PopSpec {
  x: number;
  y: number;
  scale: number;
  startMs: number;
  riseMs: number;
  swayHalfPeriodMs: number;
}

export type PopPool = SharedValue<PopSpec[]>;

export const POP_POOL = 24;
export const POP_SIZE = 9;

const SWAY_AMPLITUDE_PX = 9;
const RISE_SCREEN_FRACTION = 0.75;
const IDLE_POP: PopSpec = { x: 0, y: 0, scale: 0, startMs: -1e9, riseMs: 1, swayHalfPeriodMs: 1 };
const HIDDEN = { opacity: 0, transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 0 }] };

function easedPingPong(t: number, halfPeriod: number) {
  'worklet';
  return (1 - Math.cos((Math.PI * t) / halfPeriod)) / 2;
}

function swayOffset(t: number, halfPeriod: number) {
  'worklet';
  return interpolate(easedPingPong(t, halfPeriod), [0, 1], [-SWAY_AMPLITUDE_PX, SWAY_AMPLITUDE_PX]);
}

export function useBubbleField() {
  const clock = useSharedValue(0);
  const pops = useSharedValue<PopSpec[]>(Array.from({ length: POP_POOL }, () => IDLE_POP));
  const cursor = useSharedValue(0);

  useFrameCallback((frame) => {
    clock.value = frame.timeSinceFirstFrame;
  });

  const spawn = (x: number, y: number) => {
    'worklet';
    const next = pops.value.slice();
    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      next[(cursor.value + i) % POP_POOL] = {
        x: x + (Math.random() - 0.5) * 34,
        y: y + (Math.random() - 0.5) * 16,
        scale: (3 + Math.random() * 6) / POP_SIZE,
        startMs: clock.value + Math.random() * 280,
        riseMs: 1500 + Math.random() * 1100,
        swayHalfPeriodMs: 1100 + Math.random() * 1200,
      };
    }
    cursor.value = (cursor.value + count) % POP_POOL;
    pops.value = next;
  };

  const onPressIn = (e: GestureResponderEvent) => {
    scheduleOnUI(spawn, e.nativeEvent.locationX, e.nativeEvent.locationY);
  };

  return { clock, pops, onPressIn };
}

export function useAmbientBubbleStyle(spec: AmbientSpec, clock: SharedValue<number>, screenHeight: number) {
  const riseDist = screenHeight * RISE_SCREEN_FRACTION;
  return useAnimatedStyle(() => {
    const t = Math.max(0, clock.value - spec.delayMs);
    const rise = (t % spec.riseMs) / spec.riseMs;
    return {
      opacity: interpolate(rise, [0, 0.05, 0.78, 1], [0, 0.85, 0.7, 0]),
      transform: [
        { translateY: -riseDist * rise },
        { translateX: swayOffset(t, spec.swayHalfPeriodMs) },
        { scale: interpolate(rise, [0, 1], [0.72, 1.12]) },
      ],
    };
  });
}

export function usePopBubbleStyle(index: number, pops: PopPool, clock: SharedValue<number>) {
  return useAnimatedStyle(() => {
    const s = pops.value[index];
    const t = clock.value - s.startMs;
    if (!(t >= 0 && t <= s.riseMs)) return HIDDEN;
    const p = t / s.riseMs;
    const rise = 1 - (1 - p) * (1 - p);
    return {
      opacity: interpolate(rise, [0, 0.18, 1], [0, 0.95, 0]),
      transform: [
        { translateX: s.x + swayOffset(t, s.swayHalfPeriodMs) },
        { translateY: s.y + interpolate(rise, [0, 1], [8, -132]) },
        { scale: s.scale * interpolate(rise, [0, 1], [0.15, 1]) },
      ],
    };
  });
}
