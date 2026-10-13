import { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { ramp } from '@/lib/motion';
import { TRACK_NODE } from '../config/trackLayout';
import { JOURNAL_SLIDE, NODE_CASCADE } from '../config/journalTiming';
import { alongTrack, type TrackGeometry } from './useTrackGeometry';

const STEPS = [0, 1, 2, 3];
function dimmed(a: number, future: boolean): number {
  'worklet';
  return interpolate(a, TRACK_NODE.dimAt, TRACK_NODE.dim, Extrapolation.CLAMP) * (future ? TRACK_NODE.futureOpacity : 1);
}

const MOON_CENTER_X = TRACK_NODE.boxWidth - TRACK_NODE.ring / 2;

export function useTrackNode(
  scroll: SharedValue<number>,
  progress: SharedValue<number>,
  index: number,
  future: boolean,
  g: TrackGeometry,
) {
  const node = useAnimatedStyle(() => {
    const d = index - scroll.value;
    const a = Math.abs(d);
    const p = alongTrack(d, g.near, g.step);
    const order = Math.min(Math.max(d + 3, 0), 6) / 6;
    const start = NODE_CASCADE.start + order * NODE_CASCADE.spread;
    const arrive = ramp(progress.value, start, start + NODE_CASCADE.length);
    const back = (1 - arrive) * JOURNAL_SLIDE.nodes;
    const edge = interpolate(a, TRACK_NODE.edgeAt, [1, 0], Extrapolation.CLAMP);
    return {
      opacity: edge * arrive,
      transform: [
        { translateX: g.fx + (p - back) * g.cos - MOON_CENTER_X },
        { translateY: g.fy - (p - back) * g.sin - TRACK_NODE.boxHeight / 2 },
      ],
    };
  });

  const moon = useAnimatedStyle(() => {
    const a = Math.abs(index - scroll.value);
    return { transform: [{ scale: interpolate(a, STEPS, TRACK_NODE.sizes, Extrapolation.CLAMP) * g.scale }] };
  });

  const ring = useAnimatedStyle(() => ({
    opacity: interpolate(Math.abs(index - scroll.value), [0, 0.45], [1, 0], Extrapolation.CLAMP),
  }));

  const veil = useAnimatedStyle(() => ({
    opacity: 1 - dimmed(Math.abs(index - scroll.value), future),
  }));

  const label = useAnimatedStyle(() => {
    const a = Math.abs(index - scroll.value);
    const size = interpolate(a, STEPS, TRACK_NODE.sizes, Extrapolation.CLAMP) * g.scale;
    const shift = ((1 - size) * TRACK_NODE.ring) / 2;
    return {
      opacity: dimmed(a, future),
      transform: [
        { translateX: shift },
        { scale: interpolate(a, STEPS, TRACK_NODE.numeralScale, Extrapolation.CLAMP) * g.scale },
      ],
    };
  });

  return { node, moon, veil, ring, label };
}
