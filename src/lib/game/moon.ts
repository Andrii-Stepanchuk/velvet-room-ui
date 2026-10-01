import { lunationAt, phaseInstant } from './lunarPhases';

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

export interface MoonState {
  index: number;
  name: MoonPhaseName;
  age: number;
  cycleProgress: number;
  illumination: number;
  waxing: boolean;
}

export interface LunarCycle {
  length: number;
  dayIndex: number;
  newMoonIndex: number;
}

const DAY_MS = 86_400_000;
const PRINCIPAL_QUARTERS = [0, 0.25, 0.5, 0.75, 1] as const;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function localNoon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

function dayDiff(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);
}

function phaseIndex(date: Date, k: number, noon: Date): number {
  for (const quarter of PRINCIPAL_QUARTERS) {
    if (dayDiff(date, phaseInstant(k + quarter)) === 0) return (quarter * 8) % 8;
  }
  if (noon < phaseInstant(k + 0.25)) return 1;
  if (noon < phaseInstant(k + 0.5)) return 3;
  if (noon < phaseInstant(k + 0.75)) return 5;
  return 7;
}

export function getMoonState(date: Date): MoonState {
  const noon = localNoon(date);
  const k = lunationAt(noon);
  const newMoon = phaseInstant(k).getTime();
  const fullMoon = phaseInstant(k + 0.5).getTime();
  const nextNewMoon = phaseInstant(k + 1).getTime();
  const t = noon.getTime();
  const cycleProgress =
    t < fullMoon ? (0.5 * (t - newMoon)) / (fullMoon - newMoon) : 0.5 + (0.5 * (t - fullMoon)) / (nextNewMoon - fullMoon);
  const index = phaseIndex(date, k, noon);
  return {
    index,
    name: MOON_PHASES[index],
    age: (t - newMoon) / DAY_MS,
    cycleProgress,
    illumination: (1 - Math.cos(2 * Math.PI * cycleProgress)) / 2,
    waxing: cycleProgress < 0.5,
  };
}

function lastFullMoonK(date: Date): number {
  const k = lunationAt(localNoon(date)) + 0.5;
  return dayDiff(date, phaseInstant(k)) > 0 ? k - 1 : k;
}

function nextFullMoonK(date: Date): number {
  const k = lunationAt(localNoon(date)) + 0.5;
  return dayDiff(date, phaseInstant(k)) < 0 ? k + 1 : k;
}

export function isFullMoonDay(date: Date): boolean {
  return dayDiff(date, phaseInstant(nextFullMoonK(date))) === 0;
}

export function daysUntilFullMoon(date: Date): number {
  return dayDiff(date, phaseInstant(nextFullMoonK(date)));
}

export function nextFullMoonDate(date: Date): Date {
  return startOfDay(phaseInstant(nextFullMoonK(date)));
}

export function getLunarCycle(date: Date): LunarCycle {
  const k = isFullMoonDay(date) ? lastFullMoonK(date) - 1 : lastFullMoonK(date);
  const last = phaseInstant(k);
  return {
    length: dayDiff(last, phaseInstant(k + 1)),
    dayIndex: dayDiff(last, date),
    newMoonIndex: dayDiff(last, phaseInstant(k + 0.5)),
  };
}
