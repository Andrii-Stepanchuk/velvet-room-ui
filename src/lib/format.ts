import { CONFIG } from '@/constants/config';
import type { Boosts } from '@/lib/game';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;

export function formatShortDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function formatDayLabel(date: Date): string {
  return `${WEEKDAYS[date.getDay()]} · ${formatShortDate(date)}`;
}

export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function formatMultiplier(multiplier: number): string {
  return `×${multiplier.toFixed(1)}`;
}

export interface CountdownCopy {
  value: string;
  unit: string;
  caption: string;
  label: string;
}

function copy(value: string, unit: string, caption: string): CountdownCopy {
  return { value, unit, caption, label: `${value} ${unit}, ${caption}` };
}

export function countdownCopy(daysUntilFullMoon: number, boosts: Boosts): CountdownCopy {
  const multiplier = formatMultiplier(boosts.multiplier);
  const until = formatHour(CONFIG.boosts.darkHour.endHour);
  if (boosts.fullMoon && boosts.darkHour) return copy(multiplier, 'FULL MOON', `DARK HOUR · TO ${until}`);
  if (boosts.fullMoon) return copy(multiplier, 'FULL MOON', 'XP ALL DAY');
  if (boosts.darkHour) return copy(multiplier, 'DARK HOUR', `XP UNTIL ${until}`);
  return copy(String(daysUntilFullMoon), daysUntilFullMoon === 1 ? 'DAY' : 'DAYS', 'UNTIL THE FULL MOON');
}
