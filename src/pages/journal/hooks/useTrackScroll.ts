import { useCallback, useEffect, useMemo, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  useAnimatedReaction,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ENTER_EASING, SCREEN_TIMING } from '@/constants/motion';
import { TRACK } from '../config/trackLayout';
import { RADAR_TIMING, TRACK_GLIDE, TRACK_JUMP } from '../config/journalTiming';
import { daysAlong, type TrackGeometry } from './useTrackGeometry';

export function useTrackScroll(g: TrackGeometry, initial: number, lastIndex: number, onSelect: (index: number) => void) {
  const reducedMotion = useReducedMotion();
  const scroll = useSharedValue(initial);
  const start = useSharedValue(initial);
  const max = useSharedValue(lastIndex);
  const moving = useSharedValue(0);
  const fade = useSharedValue(1);
  const [anchor, setAnchor] = useState(initial);

  useEffect(() => {
    max.value = lastIndex;
  }, [lastIndex, max]);

  useAnimatedReaction(
    () => Math.round(scroll.value),
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setAnchor, current);
    },
  );

  const glideTo = useCallback(
    (target: number, velocity: number) => {
      'worklet';
      moving.value = withTiming(1, { duration: RADAR_TIMING.fadeMs });
      const rest = (finished?: boolean) => {
        'worklet';
        if (finished) moving.value = withTiming(0, { duration: RADAR_TIMING.fadeMs });
      };
      scroll.value = reducedMotion
        ? withTiming(target, { duration: SCREEN_TIMING.reduced }, rest)
        : withSpring(target, { ...TRACK_GLIDE, velocity }, rest);
      scheduleOnRN(onSelect, target);
    },
    [moving, scroll, reducedMotion, onSelect],
  );

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .minDistance(6)
      .onStart(() => {
        cancelAnimation(scroll);
        start.value = scroll.value;
        moving.value = withTiming(1, { duration: RADAR_TIMING.fadeMs });
      })
      .onUpdate((e) => {
        const along = e.translationX * g.cos - e.translationY * g.sin;
        const raw = start.value - along / g.near;
        scroll.value =
          raw < 0 ? raw * TRACK_GLIDE.rubber : raw > max.value ? max.value + (raw - max.value) * TRACK_GLIDE.rubber : raw;
      })
      .onEnd((e) => {
        const days = -(e.velocityX * g.cos - e.velocityY * g.sin) / g.near;
        const target = Math.min(Math.max(Math.round(scroll.value + days * TRACK_GLIDE.fling), 0), max.value);
        glideTo(target, days);
      });

    const tap = Gesture.Tap()
      .maxDuration(260)
      .onEnd((e, success) => {
        if (!success) return;
        const dx = e.x - g.fx;
        const dy = e.y - g.fy;
        if (Math.abs(dx * g.sin + dy * g.cos) > TRACK.tapReach * g.scale) return;
        const current = Math.round(scroll.value);
        const target = Math.round(scroll.value + daysAlong(dx * g.cos - dy * g.sin, g.near, g.step));
        if (target < 0 || target > max.value || target === current) return;
        glideTo(target, 0);
      });

    return Gesture.Exclusive(pan, tap);
  }, [g, scroll, start, max, moving, glideTo]);

  const step = useCallback(
    (delta: number) => {
      const target = Math.min(Math.max(Math.round(scroll.value) + delta, 0), max.value);
      if (target !== Math.round(scroll.value)) glideTo(target, 0);
    },
    [scroll, max, glideTo],
  );

  const jumpTo = useCallback(
    (index: number) => {
      const current = Math.round(scroll.value);
      if (index === current) return;
      if (reducedMotion || Math.abs(index - current) <= TRACK_JUMP.nearDays) {
        moving.value = withTiming(1, { duration: RADAR_TIMING.fadeMs });
        scroll.value = withTiming(
          index,
          { duration: reducedMotion ? SCREEN_TIMING.reduced : TRACK_JUMP.glideMs, easing: ENTER_EASING },
          (finished) => {
            if (finished) moving.value = withTiming(0, { duration: RADAR_TIMING.fadeMs });
          },
        );
        onSelect(index);
        return;
      }
      moving.value = withTiming(1, { duration: RADAR_TIMING.fadeMs });
      fade.value = withTiming(0, { duration: TRACK_JUMP.fadeMs }, (finished) => {
        if (!finished) return;
        scroll.value = index;
        fade.value = withTiming(1, { duration: TRACK_JUMP.inMs, easing: ENTER_EASING });
        moving.value = withTiming(0, { duration: RADAR_TIMING.fadeMs });
      });
      onSelect(index);
    },
    [scroll, moving, fade, reducedMotion, onSelect],
  );

  const sync = useCallback(
    (index: number) => {
      cancelAnimation(scroll);
      scroll.value = index;
      setAnchor(index);
    },
    [scroll],
  );

  return { scroll, moving, fade, anchor, gesture, step, jumpTo, sync };
}
