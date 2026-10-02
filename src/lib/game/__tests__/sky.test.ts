import { describe, expect, it } from '@jest/globals';
import { boostsAt, skyDate } from '../sky';
import { dayKey } from '../schedule';
import { isFullMoonDay, nextFullMoonDate } from '../moon';

describe('sky overrides', () => {
  const clock = new Date(2026, 9, 6, 20, 30);

  it('forcing the full moon moves the sky, not the calendar', () => {
    expect(isFullMoonDay(skyDate(clock, { darkHour: false, fullMoon: true }))).toBe(true);
    expect(dayKey(clock)).toBe('2026-10-06');
    expect(boostsAt(clock, { darkHour: false, fullMoon: true }).fullMoon).toBe(true);
  });

  it('The Moon opens the Dark Hour at 20:00', () => {
    const ordinary = isFullMoonDay(clock) ? new Date(2026, 9, 1, 20, 30) : clock;
    expect(boostsAt(ordinary).darkHour).toBe(false);
    expect(boostsAt(ordinary, undefined, true)).toMatchObject({ darkHour: true, multiplier: 1.5, darkHourStart: 20 });
  });

  it('a Full Moon evening stacks to the cap', () => {
    const fullMoon = nextFullMoonDate(clock);
    const evening = new Date(fullMoon.getFullYear(), fullMoon.getMonth(), fullMoon.getDate(), 22);
    expect(boostsAt(evening).multiplier).toBe(3);
  });
});
