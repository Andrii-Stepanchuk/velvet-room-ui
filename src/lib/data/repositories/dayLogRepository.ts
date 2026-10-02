import { desc } from 'drizzle-orm';

import { getDb } from '@/lib/db/client';
import { xpAward, dayLog, quest } from '@/lib/db/schema';
import { addDays, dayKey, entriesForDay, tallyDay, type DayKey } from '@/lib/game';

export const dayLogRepository = {
  query() {
    return getDb().select().from(dayLog);
  },

  finalizeThrough(today: DayKey): number {
    return getDb().transaction((tx) => {
      const quests = tx.select().from(quest).all();
      if (quests.length === 0) return 0;
      const last = tx.select({ day: dayLog.day }).from(dayLog).orderBy(desc(dayLog.day)).limit(1).get();
      const first = quests.reduce((min, q) => {
        const created = dayKey(q.createdAt);
        return created < min ? created : min;
      }, today);
      let day = last ? addDays(last.day, 1) : first;
      if (day >= today) return 0;
      const ledger = tx.select().from(xpAward).all();
      const now = new Date();
      let written = 0;
      while (day < today) {
        const tally = tallyDay(entriesForDay(quests, ledger, day, today));
        tx.insert(dayLog)
          .values({ day, ...tally, finalizedAt: now })
          .onConflictDoNothing()
          .run();
        written += 1;
        day = addDays(day, 1);
      }
      return written;
    });
  },
};
