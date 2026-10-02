import { describe, expect, it } from '@jest/globals';
import { EFFORTS, CHALLENGES, questBaseXp, xpBand } from '../questXp';

describe('quest pricing (rulebook §2.3)', () => {
  const table: Record<string, [number, number, number]> = {
    quick: [30, 40, 45],
    short: [45, 55, 70],
    session: [65, 80, 100],
    deep: [90, 115, 135],
    epic: [140, 175, 210],
  };

  it.each(Object.entries(table))('%s rates', (effort, expected) => {
    const row = CHALLENGES.map((c) => questBaseXp(effort as (typeof EFFORTS)[number]['key'], c.key));
    expect(row).toEqual(expected);
  });

  it('bands match concept §4.7', () => {
    expect(xpBand(45)).toBe('small');
    expect(xpBand(55)).toBe('medium');
    expect(xpBand(80)).toBe('medium');
    expect(xpBand(90)).toBe('large');
  });
});
