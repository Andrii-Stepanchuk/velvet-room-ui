import { getBoosts, type Boosts } from './boosts';
import { nextFullMoonDate } from './moon';

export interface SkyOverrides {
  darkHour: boolean;
  fullMoon: boolean;
}

export const NO_OVERRIDES: SkyOverrides = { darkHour: false, fullMoon: false };

function atTimeOf(day: Date, time: Date): Date {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
  );
}

export function skyDate(clock: Date, overrides: SkyOverrides = NO_OVERRIDES): Date {
  return overrides.fullMoon ? atTimeOf(nextFullMoonDate(clock), clock) : clock;
}

export function boostsAt(clock: Date, overrides: SkyOverrides = NO_OVERRIDES, earlyDarkHour = false): Boosts {
  return getBoosts(skyDate(clock, overrides), { darkHour: overrides.darkHour, earlyDarkHour });
}
