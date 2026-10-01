import { CONFIG } from '@/constants/config';

export const MOON_PHASES = [
  'New Moon',
  'Waxing Crescent',
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent',
] as const;

export type MoonPhaseName = (typeof MOON_PHASES)[number];

export const FULL_MOON_INDEX = 4;

export interface MoonState {
  index: number;
  name: MoonPhaseName;
  age: number;
  cycleProgress: number;
  illumination: number;
  waxing: boolean;
}

const DAY_MS = 86_400_000;
const MAX_SEARCH_DAYS = 31;

function localNoon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

export function getMoonState(date: Date): MoonState {
  const { synodicDays, referenceNewMoonUtcMs } = CONFIG.moon;
  const days = (localNoon(date).getTime() - referenceNewMoonUtcMs) / DAY_MS;
  const age = ((days % synodicDays) + synodicDays) % synodicDays;
  const cycleProgress = age / synodicDays;
  const index = Math.floor(cycleProgress * 8 + 0.5) % 8;
  return {
    index,
    name: MOON_PHASES[index],
    age,
    cycleProgress,
    illumination: (1 - Math.cos(2 * Math.PI * cycleProgress)) / 2,
    waxing: cycleProgress < 0.5,
  };
}

export function isFullMoonDay(date: Date): boolean {
  return getMoonState(date).index === FULL_MOON_INDEX;
}

export function daysUntilFullMoon(date: Date): number {
  for (let offset = 0; offset <= MAX_SEARCH_DAYS; offset++) {
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
    if (isFullMoonDay(day)) return offset;
  }
  throw new Error('No Full Moon day found within a lunar cycle');
}

export function nextFullMoonDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysUntilFullMoon(date));
}

export function fullMoonProgress(moon: MoonState): number {
  if (moon.index === FULL_MOON_INDEX) return 1;
  return (moon.cycleProgress + 0.5) % 1;
}
