import { describe, expect, it } from '@jest/globals';
import { daySummary, firstJournalDay, groupByDay, ledgerMilestones, monthGrid, type JournalAward } from '../journal';

function award(id: number, day: string, hour: number, overrides: Partial<JournalAward> = {}): JournalAward {
  const [y, m, d] = day.split('-').map(Number);
  return { id, day, completedAt: new Date(y, m - 1, d, hour), stat: 'knowledge', awardedXp: 50, ...overrides };
}

describe('groupByDay', () => {
  it('groups awards by day and orders each day by completion time', () => {
    const days = groupByDay([award(1, '2026-10-02', 20), award(2, '2026-10-01', 9), award(3, '2026-10-02', 7)]);
    expect([...days.keys()].sort()).toEqual(['2026-10-01', '2026-10-02']);
    expect(days.get('2026-10-02')?.map((a) => a.id)).toEqual([3, 1]);
  });

  it('breaks equal times by id', () => {
    const days = groupByDay([award(5, '2026-10-01', 9), award(4, '2026-10-01', 9)]);
    expect(days.get('2026-10-01')?.map((a) => a.id)).toEqual([4, 5]);
  });
});

describe('ledgerMilestones', () => {
  it('marks the award that crosses a stat rank (450 XP for rank 2)', () => {
    const milestones = ledgerMilestones([
      award(1, '2026-10-01', 9, { awardedXp: 400 }),
      award(2, '2026-10-02', 9, { awardedXp: 50 }),
    ]);
    expect(milestones.get(1)?.some((m) => m.kind === 'rank')).toBe(false);
    expect(milestones.get(2)).toContainEqual({ kind: 'rank', awardId: 2, stat: 'knowledge', level: 2 });
  });

  it('reports the rank reached when one award crosses two ranks', () => {
    const milestones = ledgerMilestones([award(1, '2026-10-01', 9, { awardedXp: 1125 })]);
    expect(milestones.get(1)).toContainEqual({ kind: 'rank', awardId: 1, stat: 'knowledge', level: 3 });
  });

  it('marks Overall level-ups across stats (200 XP for level 2)', () => {
    const milestones = ledgerMilestones([
      award(1, '2026-10-01', 9, { awardedXp: 150, stat: 'guts' }),
      award(2, '2026-10-01', 10, { awardedXp: 60, stat: 'charm' }),
    ]);
    expect(milestones.get(2)).toEqual([{ kind: 'level', awardId: 2, level: 2 }]);
  });

  it('replays in completion order, not insertion order', () => {
    const milestones = ledgerMilestones([
      award(2, '2026-10-02', 9, { awardedXp: 50 }),
      award(1, '2026-10-01', 9, { awardedXp: 400 }),
    ]);
    expect(milestones.get(2)?.some((m) => m.kind === 'rank')).toBe(true);
    expect(milestones.has(1)).toBe(true);
    expect(milestones.get(1)?.some((m) => m.kind === 'rank')).toBe(false);
  });

  it('keeps stat ranks independent', () => {
    const milestones = ledgerMilestones([
      award(1, '2026-10-01', 9, { awardedXp: 300, stat: 'guts' }),
      award(2, '2026-10-01', 10, { awardedXp: 300, stat: 'charm' }),
    ]);
    expect([...milestones.values()].flat().some((m) => m.kind === 'rank')).toBe(false);
  });
});

describe('daySummary', () => {
  it('sums awarded XP and takes the counts from the day log', () => {
    const summary = daySummary([award(1, '2026-10-01', 9, { awardedXp: 80 }), award(2, '2026-10-01', 10, { awardedXp: 65 })], {
      scheduled: 5,
      cleared: 2,
    });
    expect(summary).toEqual({ xp: 145, cleared: 2, scheduled: 5 });
  });

  it('falls back to the awards when the day has no log', () => {
    expect(daySummary([award(1, '2026-10-01', 9)], null)).toEqual({ xp: 50, cleared: 1, scheduled: null });
  });
});

describe('firstJournalDay', () => {
  it('starts on the day the player signed', () => {
    expect(firstJournalDay(new Date(2026, 8, 20, 22), [], '2026-10-13')).toBe('2026-09-20');
  });

  it('reaches back to an earlier ledger day', () => {
    expect(firstJournalDay(new Date(2026, 8, 20), [award(1, '2026-09-02', 9)], '2026-10-13')).toBe('2026-09-02');
  });

  it('never starts after today', () => {
    expect(firstJournalDay(null, [], '2026-10-13')).toBe('2026-10-13');
  });
});

describe('monthGrid', () => {
  it('lays October 2026 out Monday-first in full weeks', () => {
    const cells = monthGrid(2026, 9);
    expect(cells.length % 7).toBe(0);
    expect(cells.slice(0, 4)).toEqual([null, null, null, '2026-10-01']);
    expect(cells.filter(Boolean)).toHaveLength(31);
  });

  it('starts flush when the 1st is a Monday', () => {
    expect(monthGrid(2026, 5)[0]).toBe('2026-06-01');
  });
});
