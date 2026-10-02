import { describe, expect, it } from '@jest/globals';
import { CONFIG } from '@/constants/config';
import { overallFromTotal, progressFromTotal, statProgressFromTotals, totalForLevel } from '../levels';

const STAT = CONFIG.curves.stat;

describe('stat curve (rulebook §4.1)', () => {
  it('needs 450, 675, 1013, 1520, 2280, 3420, 5130', () => {
    const cumulative = [1, 2, 3, 4, 5, 6, 7, 8].map((level) => totalForLevel(level, STAT));
    expect(cumulative).toEqual([0, 450, 1125, 2138, 3658, 5938, 9358, 14488]);
  });

  it('carries overflow across several levels', () => {
    expect(progressFromTotal(400 + 1260, STAT)).toMatchObject({ level: 3, xp: 535, maxXp: 1013, maxed: false });
  });

  it('stops at rank 8 with a full bar', () => {
    const top = progressFromTotal(20000, STAT);
    expect(top).toMatchObject({ level: 8, maxed: true, total: 20000 });
    expect(top.xp).toBe(top.maxXp);
  });

  it('lands exactly on a level boundary', () => {
    expect(progressFromTotal(450, STAT)).toMatchObject({ level: 2, xp: 0, maxXp: 675 });
  });

  it('starts every stat at rank 1', () => {
    expect(statProgressFromTotals({}).every((s) => s.level === 1 && s.xp === 0 && s.maxXp === 450)).toBe(true);
  });
});

describe('overall curve (rulebook §4.2)', () => {
  it.each([
    [10, 2498],
    [20, 8295],
    [30, 20819],
    [50, 106199],
  ])('level %i at %i XP', (level, total) => {
    expect(overallFromTotal(total).level).toBe(level);
    expect(overallFromTotal(total - 1).level).toBe(level - 1);
  });

  it('caps at 99', () => {
    expect(overallFromTotal(1e9)).toMatchObject({ level: 99, maxed: true });
  });
});
