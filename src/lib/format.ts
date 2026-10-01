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

export function countdownCopy(daysUntilFullMoon: number): { title: string; subtitle: string } {
  if (daysUntilFullMoon === 0) return { title: 'FULL MOON', subtitle: 'THE TIME HAS COME' };
  const unit = daysUntilFullMoon === 1 ? 'DAY' : 'DAYS';
  return { title: `${daysUntilFullMoon} ${unit}`, subtitle: 'UNTIL THE FULL MOON' };
}
