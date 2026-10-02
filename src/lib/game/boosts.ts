import { CONFIG } from '@/constants/config';
import { isFullMoonDay } from './moon';

export interface Boosts {
  darkHour: boolean;
  fullMoon: boolean;
  multiplier: number;
  darkHourStart: number;
}

export interface BoostOptions {
  darkHour?: boolean;
  earlyDarkHour?: boolean;
}

export function darkHourStart(earlyDarkHour = false): number {
  const { startHour, earlyStartHour } = CONFIG.boosts.darkHour;
  return earlyDarkHour ? earlyStartHour : startHour;
}

export function isDarkHour(date: Date, startHour: number = CONFIG.boosts.darkHour.startHour): boolean {
  const hour = date.getHours();
  return hour >= startHour && hour < CONFIG.boosts.darkHour.endHour;
}

export function getBoosts(date: Date, options: BoostOptions = {}): Boosts {
  const { darkHour: window, fullMoonMultiplier, cap } = CONFIG.boosts;
  const start = darkHourStart(options.earlyDarkHour);
  const darkHour = options.darkHour === true || isDarkHour(date, start);
  const fullMoon = isFullMoonDay(date);
  const raw = (darkHour ? window.multiplier : 1) * (fullMoon ? fullMoonMultiplier : 1);
  return { darkHour, fullMoon, multiplier: Math.min(raw, cap), darkHourStart: start };
}
