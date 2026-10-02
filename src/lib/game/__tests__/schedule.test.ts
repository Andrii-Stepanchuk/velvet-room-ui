import { describe, expect, it } from '@jest/globals';
import { canClearOn, entriesForDay, entryFor, toggleWeekday, weekdayOf } from '../schedule';
import { quest } from './helpers';

const TODAY = '2026-10-06';

describe('what is on a day (rulebook §5.3)', () => {
  it('daily from the day it was created', () => {
    const q = quest({ createdAt: new Date(2026, 9, 6, 22) });
    expect(entryFor(q, '2026-10-05', TODAY, [])).toBeNull();
    expect(entryFor(q, TODAY, TODAY, [])).toMatchObject({ done: false });
  });

  it('chosen weekdays', () => {
    const tuesday = weekdayOf(TODAY);
    const q = quest({ repeat: 'days', repeatDays: toggleWeekday(0, tuesday) });
    expect(entryFor(q, TODAY, TODAY, [])).not.toBeNull();
    expect(entryFor(q, '2026-10-07', TODAY, [])).toBeNull();
  });

  it('a one-off carries forward until cleared, but not into the future', () => {
    const q = quest({ repeat: 'once', date: '2026-10-03' });
    expect(entryFor(q, '2026-10-02', TODAY, [])).toBeNull();
    expect(entryFor(q, '2026-10-03', TODAY, [])).toMatchObject({ carriedFrom: null });
    expect(entryFor(q, TODAY, TODAY, [])).toMatchObject({ carriedFrom: '2026-10-03', done: false });
    expect(entryFor(q, '2026-10-07', TODAY, [])).toBeNull();
  });

  it('a carried one-off cleared today stops carrying', () => {
    const q = quest({ repeat: 'once', date: '2026-10-03' });
    const ledger = [{ questId: 1, day: TODAY }];
    expect(entryFor(q, TODAY, TODAY, ledger)).toMatchObject({ done: true, carriedFrom: '2026-10-03' });
    expect(entryFor(q, '2026-10-04', TODAY, ledger)).toMatchObject({ done: false });
    expect(entryFor(q, '2026-10-07', TODAY, ledger)).toBeNull();
  });

  it('a one-off can be cleared early and then belongs to that day', () => {
    const q = quest({ repeat: 'once', date: '2026-10-09' });
    expect(canClearOn(q, TODAY, [])).toBe(true);
    const ledger = [{ questId: 1, day: TODAY }];
    expect(entryFor(q, TODAY, TODAY, ledger)).toMatchObject({ done: true });
    expect(entryFor(q, '2026-10-09', TODAY, ledger)).toBeNull();
    expect(canClearOn(q, TODAY, ledger)).toBe(false);
  });

  it('a recurring quest clears once per day', () => {
    const q = quest();
    expect(canClearOn(q, TODAY, [{ questId: 1, day: TODAY }])).toBe(false);
    expect(canClearOn(q, TODAY, [{ questId: 1, day: '2026-10-05' }])).toBe(true);
  });

  it('a deleted quest leaves from the day it is deleted', () => {
    const q = quest({ archivedAt: new Date(2026, 9, 6, 8) });
    expect(entryFor(q, '2026-10-05', TODAY, [])).not.toBeNull();
    expect(entryFor(q, TODAY, TODAY, [])).toBeNull();
    expect(canClearOn(q, TODAY, [])).toBe(false);
  });

  it('lists entries in creation order', () => {
    const list = entriesForDay([quest({ id: 1 }), quest({ id: 2, repeat: 'once', date: TODAY })], [], TODAY, TODAY);
    expect(list.map((e) => e.quest.id)).toEqual([1, 2]);
  });
});
