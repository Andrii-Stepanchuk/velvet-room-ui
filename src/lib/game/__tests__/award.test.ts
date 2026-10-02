import { describe, expect, it } from '@jest/globals';
import { computeAward } from '../award';
import { isFortuneTurned } from '../blessings';
import { progressFromTotal } from '../levels';
import { CONFIG } from '@/constants/config';
import { at, ctx, stats } from './helpers';

const MOON = { darkHour: true, fullMoon: true, multiplier: 3 };

describe('worked examples (rulebook §7)', () => {
  it('A: an ordinary afternoon with The Fool', () => {
    const award = computeAward(ctx({ arcanaId: 'fool', stats: stats(), effort: 'short', challenge: 'routine' }));
    expect(award).toMatchObject({ base: 45, moonMult: 1, blessingPct: 0.1, awarded: 50 });
  });

  it('B: Dark Hour on a Full Moon with The Star ranks Knowledge up', () => {
    const award = computeAward(
      ctx({ arcanaId: 'star', effort: 'session', challenge: 'stretch', boosts: MOON, at: at(22, 10) }),
    );
    expect(award.awarded).toBe(264);
    const before = 2138 + 1300;
    expect(progressFromTotal(before, CONFIG.curves.stat)).toMatchObject({ level: 4, xp: 1300 });
    expect(progressFromTotal(before + award.awarded, CONFIG.curves.stat)).toMatchObject({ level: 5, xp: 44, maxXp: 2280 });
  });

  it('C: Fortune doubles after the sky cap', () => {
    let questId = 1;
    while (!isFortuneTurned(questId, '2026-10-06')) questId += 1;
    const award = computeAward(
      ctx({ arcanaId: 'fortune', questId, stat: 'charm', effort: 'epic', challenge: 'hard', boosts: MOON }),
    );
    expect(award.awarded).toBe(1260);
  });

  it('E: The Moon pays the Dark Hour factor without a bonus', () => {
    const award = computeAward(
      ctx({ arcanaId: 'moon', stat: 'proficiency', effort: 'session', boosts: { darkHour: true, fullMoon: false, multiplier: 1.5 } }),
    );
    expect(award).toMatchObject({ base: 65, blessingPct: 0, awarded: 98 });
  });

  it('F: Judgement on the quest that clears the day', () => {
    const award = computeAward(ctx({ arcanaId: 'judgement', stat: 'kindness', clearsDay: true }));
    expect(award.awarded).toBe(50);
  });

  it('the cap bounds the sky, not the card', () => {
    const award = computeAward(ctx({ arcanaId: 'world', effort: 'epic', challenge: 'hard', boosts: MOON }));
    expect(award.awarded).toBe(693);
  });
});
