import { useMemo } from 'react';

import { CONFIG } from '@/constants/config';
import { FULL_MOON_HALF_WINDOW, type MoonState } from '@/lib/game';
import { MOON_DIAL, MOON_DISC_RATIO } from '../config/statusLayout';

export type DialTone = 'lit' | 'litEvent' | 'ahead' | 'aheadEvent';

export interface DialSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DialTick extends DialSegment {
  tone: DialTone;
}

const DAYS = Math.ceil(CONFIG.moon.synodicDays);
const NEW_MOON = 0;
const FULL_MOON = 0.5;

function polar(center: number, radius: number, fraction: number) {
  const angle = (fraction + 0.5) * 2 * Math.PI;
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

function isEventDay(fraction: number): boolean {
  return fraction >= FULL_MOON - FULL_MOON_HALF_WINDOW && fraction < FULL_MOON + FULL_MOON_HALF_WINDOW;
}

export function useMoonDial(size: number, moon: MoonState) {
  const { age, cycleProgress } = moon;

  return useMemo(() => {
    const center = size / 2;
    const inner = (size * MOON_DISC_RATIO) / 2 + MOON_DIAL.gap;
    const outer = center - MOON_DIAL.edge;
    const mid = (inner + outer) / 2;
    const half = MOON_DIAL.tickLength / 2;

    const ticks: DialTick[] = Array.from({ length: DAYS }, (_, day) => {
      const fraction = day / CONFIG.moon.synodicDays;
      const event = isEventDay(fraction);
      const tone: DialTone = day <= age ? (event ? 'litEvent' : 'lit') : event ? 'aheadEvent' : 'ahead';
      return { ...segment(center, mid - half, mid + half, fraction), tone };
    });

    return {
      center,
      band: { radius: mid, width: outer - inner },
      rim: outer,
      ticks,
      today: segment(center, inner - MOON_DIAL.todayOverhang, outer + MOON_DIAL.todayOverhang, cycleProgress),
      fullMarker: diamond(center, outer, FULL_MOON, MOON_DIAL.fullMarker),
      newMarker: diamond(center, outer, NEW_MOON, MOON_DIAL.newMarker),
    };
  }, [size, age, cycleProgress]);
}
