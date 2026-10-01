import { CONFIG } from '@/constants/config';
import { isFullMoonDay } from './moon';

export interface Boosts {
  darkHour: boolean;
  fullMoon: boolean;
  multiplier: number;
}

export function isDarkHour(date: Date): boolean {
  const { startHour, endHour } = CONFIG.boosts.darkHour;
  const hour = date.getHours();
  return hour >= startHour && hour < endHour;
}

export function getBoosts(date: Date, force: { darkHour?: boolean } = {}): Boosts {
  const { darkHour: window, fullMoonMultiplier, cap } = CONFIG.boosts;
  const darkHour = force.darkHour === true || isDarkHour(date);
  const fullMoon = isFullMoonDay(date);
  const raw = (darkHour ? window.multiplier : 1) * (fullMoon ? fullMoonMultiplier : 1);
  return { darkHour, fullMoon, multiplier: Math.min(raw, cap) };
}
