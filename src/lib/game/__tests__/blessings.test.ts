import { describe, expect, it } from '@jest/globals';
import { blessingBonus, fortuneHash, isFortuneTurned, opensDarkHourEarly } from '../blessings';
import { ARCANA } from '../arcanaData';
import { at, ctx, stats } from './helpers';

const NIGHT = { darkHour: true, fullMoon: false, multiplier: 1.5 };
const FULL = { darkHour: false, fullMoon: true, multiplier: 2 };

function bonus(...args: Parameters<typeof ctx>) {
  const c = ctx(...args);
  return blessingBonus(c.arcanaId, c);
}

describe('every Arcana has a rule', () => {
  it.each(ARCANA.map((a) => a.id))('%s', (id) => {
    expect(() => bonus({ arcanaId: id })).not.toThrow();
  });
});

describe('blessing conditions (rulebook §6.3)', () => {
  it('Fool: lowest stat only, ties all count', () => {
    expect(bonus({ arcanaId: 'fool', stat: 'knowledge' })).toBe(0.1);
    expect(bonus({ arcanaId: 'fool', stat: 'guts' })).toBe(0);
    expect(bonus({ arcanaId: 'fool', stat: 'charm', stats: stats() })).toBe(0.1);
  });

  it('Magician and Hierophant need a Knowledge quest earlier today', () => {
    expect(bonus({ arcanaId: 'magician', stat: 'proficiency' })).toBe(0);
    expect(bonus({ arcanaId: 'magician', stat: 'proficiency', clearedStatsToday: ['knowledge'] })).toBe(0.1);
    expect(bonus({ arcanaId: 'magician', stat: 'guts', clearedStatsToday: ['knowledge'] })).toBe(0);
    expect(bonus({ arcanaId: 'hierophant', stat: 'kindness', clearedStatsToday: ['knowledge'] })).toBe(0.1);
  });

  it('Dark Hour cards', () => {
    expect(bonus({ arcanaId: 'priestess', stat: 'knowledge', boosts: NIGHT })).toBe(0.1);
    expect(bonus({ arcanaId: 'priestess', stat: 'knowledge' })).toBe(0);
    expect(bonus({ arcanaId: 'hermit', stat: 'proficiency', boosts: NIGHT })).toBe(0.1);
    expect(bonus({ arcanaId: 'hanged', stat: 'kindness', boosts: NIGHT })).toBe(0.1);
    expect(bonus({ arcanaId: 'devil', stat: 'charm', boosts: NIGHT })).toBe(0.1);
    expect(bonus({ arcanaId: 'devil', stat: 'guts', boosts: NIGHT })).toBe(0);
  });

  it('flat stat cards', () => {
    expect(bonus({ arcanaId: 'empress', stat: 'kindness' })).toBe(0.1);
    expect(bonus({ arcanaId: 'emperor', stat: 'charm' })).toBe(0.1);
    expect(bonus({ arcanaId: 'justice', stat: 'knowledge' })).toBe(0.1);
    expect(bonus({ arcanaId: 'tower', stat: 'guts' })).toBe(0.1);
    expect(bonus({ arcanaId: 'tower', stat: 'knowledge' })).toBe(0);
    expect(bonus({ arcanaId: 'lovers', stat: 'charm' })).toBe(0.05);
    expect(bonus({ arcanaId: 'lovers', stat: 'guts' })).toBe(0);
  });

  it('Chariot needs a streak of 3', () => {
    expect(bonus({ arcanaId: 'chariot', streak: 2 })).toBe(0);
    expect(bonus({ arcanaId: 'chariot', streak: 3 })).toBe(0.1);
  });

  it('Strength, Death: HARD and DEEP/EPIC', () => {
    expect(bonus({ arcanaId: 'strength', challenge: 'hard' })).toBe(0.1);
    expect(bonus({ arcanaId: 'strength', challenge: 'stretch' })).toBe(0);
    expect(bonus({ arcanaId: 'death', effort: 'deep' })).toBe(0.1);
    expect(bonus({ arcanaId: 'death', effort: 'epic' })).toBe(0.1);
    expect(bonus({ arcanaId: 'death', effort: 'session' })).toBe(0);
  });

  it('Temperance: spread of at most 2', () => {
    expect(bonus({ arcanaId: 'temperance', stats: stats({ knowledge: 4, guts: 2, proficiency: 3, kindness: 3, charm: 2 }) })).toBe(0.05);
    expect(bonus({ arcanaId: 'temperance', stats: stats({ knowledge: 4 }) })).toBe(0);
  });

  it('Star: Kindness and Knowledge on the Full Moon', () => {
    expect(bonus({ arcanaId: 'star', stat: 'knowledge', boosts: FULL })).toBe(0.1);
    expect(bonus({ arcanaId: 'star', stat: 'kindness', boosts: FULL })).toBe(0.1);
    expect(bonus({ arcanaId: 'star', stat: 'charm', boosts: FULL })).toBe(0);
    expect(bonus({ arcanaId: 'star', stat: 'knowledge' })).toBe(0);
  });

  it('Sun: before noon', () => {
    expect(bonus({ arcanaId: 'sun', at: at(11, 59) })).toBe(0.1);
    expect(bonus({ arcanaId: 'sun', at: at(12) })).toBe(0);
  });

  it('Judgement: the quest that clears the day', () => {
    expect(bonus({ arcanaId: 'judgement', clearsDay: true })).toBe(0.1);
    expect(bonus({ arcanaId: 'judgement' })).toBe(0);
  });

  it('World: every quest', () => {
    expect(bonus({ arcanaId: 'world', stat: 'guts' })).toBe(0.1);
  });

  it('Moon opens the Dark Hour early instead of a bonus', () => {
    expect(bonus({ arcanaId: 'moon' })).toBe(0);
    expect(opensDarkHourEarly('moon')).toBe(true);
    expect(opensDarkHourEarly('star')).toBe(false);
  });
});

describe('Fortune', () => {
  it('is deterministic per quest and day', () => {
    expect(fortuneHash('12:2026-10-06')).toBe(fortuneHash('12:2026-10-06'));
    expect(isFortuneTurned(12, '2026-10-06')).toBe(isFortuneTurned(12, '2026-10-06'));
  });

  it('turns about one quest in eight', () => {
    let turned = 0;
    const samples = 8000;
    for (let id = 1; id <= samples; id += 1) if (isFortuneTurned(id, '2026-10-06')) turned += 1;
    expect(turned / samples).toBeGreaterThan(0.1);
    expect(turned / samples).toBeLessThan(0.15);
  });
});
