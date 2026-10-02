import { describe, expect, it } from '@jest/globals';
import { streakFrom } from '../streak';

const log = (day: string, scheduled: number, cleared: number) => ({ day, scheduled, cleared });

describe('streak (rulebook §5.4)', () => {
  it('counts consecutive cleared days and skips rest days', () => {
    const logs = [log('2026-10-01', 3, 3), log('2026-10-02', 0, 0), log('2026-10-03', 2, 2), log('2026-10-04', 4, 4)];
    expect(streakFrom(logs, '2026-10-05', { scheduled: 3, cleared: 1 })).toBe(3);
  });

  it('breaks on a missed day', () => {
    const logs = [log('2026-10-03', 2, 2), log('2026-10-04', 4, 3)];
    expect(streakFrom(logs, '2026-10-05', { scheduled: 3, cleared: 0 })).toBe(0);
  });

  it('includes today once it is cleared', () => {
    const logs = [log('2026-10-04', 4, 4)];
    expect(streakFrom(logs, '2026-10-05', { scheduled: 3, cleared: 3 })).toBe(2);
  });
});
