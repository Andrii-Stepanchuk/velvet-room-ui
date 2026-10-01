import { useMemo } from 'react';

import type { LunarCycle } from '@/lib/game';
import { BOOST_FX } from '../config/boostFx';
import { MOON_DIAL, MOON_DISC_RATIO } from '../config/statusLayout';

export type DialTone = 'lit' | 'litEvent' | 'ahead';

export interface DialSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DialTick extends DialSegment {
  tone: DialTone;
}

const FULL_MOON = 0;

function polar(center: number, radius: number, fraction: number) {
  const angle = fraction * 2 * Math.PI;
  return { x: center + radius * Math.sin(angle), y: center - radius * Math.cos(angle) };
}

function segment(center: number, inner: number, outer: number, fraction: number): DialSegment {
  const a = polar(center, inner, fraction);
  const b = polar(center, outer, fraction);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}

function diamond(center: number, radius: number, fraction: number, half: number): string {
  const { x, y } = polar(center, radius, fraction);
  return `${x},${y - half} ${x + half},${y} ${x},${y + half} ${x - half},${y}`;
}

export function dialAngle(fraction: number): number {
  return fraction * 360 - 90;
}

export function dialBand(size: number) {
  const inner = (size * MOON_DISC_RATIO) / 2 + MOON_DIAL.gap;
  const outer = size / 2 - MOON_DIAL.edge;
  return { inner, outer, radius: (inner + outer) / 2, width: outer - inner };
}

export function useMoonDial(size: number, cycle: LunarCycle) {
  const { length, dayIndex, newMoonIndex } = cycle;

  return useMemo(() => {
    const center = size / 2;
    const { inner, outer, radius: mid, width } = dialBand(size);
    const half = MOON_DIAL.tickLength / 2;
    const tickAt = (day: number) => segment(center, mid - half, mid + half, day / length);

    const ticks: DialTick[] = Array.from({ length }, (_, day) => ({
      ...tickAt(day),
      tone: day === 0 ? 'litEvent' : day <= dayIndex ? 'lit' : 'ahead',
    }));

    return {
      center,
      inner,
      band: { radius: mid, width },
      rim: outer,
      ticks,
      eventTicks: [tickAt(0)],
      today: segment(center, inner - MOON_DIAL.todayOverhang, outer + MOON_DIAL.todayOverhang, dayIndex / length),
      fullMarker: diamond(center, outer, FULL_MOON, MOON_DIAL.fullMarker),
      newMarker: diamond(center, outer, newMoonIndex / length, MOON_DIAL.newMarker),
      fullMarkerHalo: diamond(center, outer, FULL_MOON, MOON_DIAL.fullMarker * BOOST_FX.fullMarkerHalo),
    };
  }, [size, length, dayIndex, newMoonIndex]);
}
