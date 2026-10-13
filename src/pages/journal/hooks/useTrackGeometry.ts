import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { TRACK, TRACK_BAND } from '../config/trackLayout';

export interface TrackGeometry {
  width: number;
  height: number;
  fx: number;
  fy: number;
  cos: number;
  sin: number;
  near: number;
  step: number;
  scale: number;
}

export function alongTrack(d: number, near: number, step: number): number {
  'worklet';
  const a = Math.abs(d);
  const p = a <= 1 ? a * near : near + (a - 1) * step;
  return d < 0 ? -p : p;
}

export function daysAlong(s: number, near: number, step: number): number {
  'worklet';
  const a = Math.abs(s);
  const d = a <= near ? a / near : 1 + (a - near) / step;
  return s < 0 ? -d : d;
}

export function bandCenterY(x: number, g: TrackGeometry): number {
  return g.fy - TRACK_BAND.lift * g.scale + (x - g.fx) * Math.tan((TRACK_BAND.slant * Math.PI) / 180);
}

export function useTrackGeometry(): TrackGeometry {
  const { width, height: screen } = useWindowDimensions();
  return useMemo(() => {
    const height = Math.round(Math.min(Math.max(screen * TRACK.heightRatio, TRACK.minHeight), TRACK.maxHeight));
    const scale = Math.min(1, width / TRACK.refWidth, height / TRACK.refHeight);
    const rad = (TRACK.angle * Math.PI) / 180;
    return {
      width,
      height,
      fx: width * TRACK.focusX,
      fy: height * TRACK.focusY,
      cos: Math.cos(rad),
      sin: Math.sin(rad),
      near: TRACK.near * scale,
      step: TRACK.step * scale,
      scale,
    };
  }, [width, screen]);
}
