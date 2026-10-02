import type { DayKey, DayTally } from './schedule';

export interface DayLogEntry extends DayTally {
  day: DayKey;
}

export function isCleared({ scheduled, cleared }: DayTally): boolean {
  return scheduled > 0 && cleared >= scheduled;
}

export function streakFrom(logs: readonly DayLogEntry[], today: DayKey, todayTally: DayTally): number {
  const past = logs.filter((log) => log.day < today).sort((a, b) => (a.day < b.day ? 1 : -1));
  let streak = 0;
  for (const log of past) {
    if (log.scheduled === 0) continue;
    if (!isCleared(log)) break;
    streak += 1;
  }
  return isCleared(todayTally) ? streak + 1 : streak;
}
