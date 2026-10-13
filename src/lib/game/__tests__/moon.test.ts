import { describe, expect, it } from '@jest/globals';
import { lunationAt, phaseInstant } from '../lunarPhases';
import { getLunarCycle, isFullMoonDay, nextFullMoonDate } from '../moon';

const MINUTE_MS = 60_000;

describe('true phases', () => {
  it('places the October 2026 full moon within two minutes of the almanac', () => {
    const k = lunationAt(new Date(Date.UTC(2026, 9, 20))) + 0.5;
    const expected = Date.UTC(2026, 9, 26, 4, 11);
    expect(Math.abs(phaseInstant(k).getTime() - expected)).toBeLessThan(2 * MINUTE_MS);
  });
});

describe('lunar cycle', () => {
  const fullMoon = nextFullMoonDate(new Date(2026, 9, 13));

  it('closes the cycle on the Full Moon day', () => {
    expect(isFullMoonDay(fullMoon)).toBe(true);
    const cycle = getLunarCycle(fullMoon);
    expect(cycle.dayIndex).toBe(cycle.length);
  });

  it('opens a new cycle at day 1 the day after', () => {
    const next = new Date(fullMoon.getFullYear(), fullMoon.getMonth(), fullMoon.getDate() + 1);
    expect(getLunarCycle(next).dayIndex).toBe(1);
  });

  it('keeps every day of the year within 1…length', () => {
    for (let i = 0; i < 365; i += 1) {
      const { dayIndex, length, newMoonIndex } = getLunarCycle(new Date(2026, 0, 1 + i));
      expect(dayIndex).toBeGreaterThanOrEqual(1);
      expect(dayIndex).toBeLessThanOrEqual(length);
      expect([29, 30]).toContain(length);
      expect(newMoonIndex).toBeGreaterThan(0);
      expect(newMoonIndex).toBeLessThan(length);
    }
  });
});
