import { and, eq, sql } from 'drizzle-orm';

import { getDb } from '@/lib/db/client';
import { xpAward, dayLog, quest, type XpAwardRow } from '@/lib/db/schema';
import {
  boostsAt,
  canClearOn,
  computeAward,
  dayKey,
  deriveArcana,
  emptyTotals,
  entriesForDay,
  opensDarkHourEarly,
  progressFromTotal,
  statProgressFromTotals,
  streakFrom,
  tallyDay,
  type Award,
  type SkyOverrides,
  type StatKey,
  type StatTotals,
} from '@/lib/game';
import { CONFIG } from '@/constants/config';

type Db = ReturnType<typeof getDb>;
type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

export interface ClearResult {
  questId: number;
  stat: StatKey;
  award: Award;
  levelBefore: number;
  levelAfter: number;
}

function totalsFrom(tx: Tx): StatTotals {
  const rows = tx
    .select({ stat: xpAward.stat, total: sql<number>`sum(${xpAward.awardedXp})` })
    .from(xpAward)
    .groupBy(xpAward.stat)
    .all();
  const totals = emptyTotals();
  for (const row of rows) totals[row.stat] = Number(row.total) || 0;
  return totals;
}

function clearOne(tx: Tx, questId: number, clock: Date, overrides: SkyOverrides): ClearResult | null {
  const day = dayKey(clock);
  const target = tx.select().from(quest).where(eq(quest.id, questId)).get();
  if (!target) return null;

  const ledger = tx.select().from(xpAward).all();
  if (!canClearOn(target, day, ledger)) return null;

  const totals = totalsFrom(tx);
  const stats = statProgressFromTotals(totals);
  const arcana = deriveArcana(stats);
  const quests = tx.select().from(quest).all();
  const todayBefore = entriesForDay(quests, ledger, day, day);
  const others = todayBefore.filter((entry) => entry.quest.id !== questId);
  const clearsDay = others.every((entry) => entry.done);
  const logs = tx.select().from(dayLog).all();
  const streak = streakFrom(logs, day, tallyDay(todayBefore));
  const boosts = boostsAt(clock, overrides, opensDarkHourEarly(arcana.id));

  const award = computeAward({
    questId,
    stat: target.stat,
    effort: target.effort,
    challenge: target.challenge,
    at: clock,
    day,
    boosts,
    stats,
    clearedStatsToday: ledger.filter((c) => c.day === day).map((c) => c.stat),
    streak,
    clearsDay,
    arcanaId: arcana.id,
  });

  tx.insert(xpAward)
    .values({
      questId,
      day,
      completedAt: clock,
      stat: target.stat,
      titleSnapshot: target.title,
      baseXp: award.base,
      moonMult: award.moonMult,
      darkHour: award.darkHour,
      fullMoon: award.fullMoon,
      arcanaId: award.arcanaId,
      blessingPct: award.blessingPct,
      awardedXp: award.awarded,
    })
    .run();

  const before = totals[target.stat];
  return {
    questId,
    stat: target.stat,
    award,
    levelBefore: progressFromTotal(before, CONFIG.curves.stat).level,
    levelAfter: progressFromTotal(before + award.awarded, CONFIG.curves.stat).level,
  };
}

export const xpAwardRepository = {
  query() {
    return getDb().select().from(xpAward);
  },

  all(): XpAwardRow[] {
    return xpAwardRepository.query().all();
  },

  clear(questIds: readonly number[], overrides: SkyOverrides, clock: Date = new Date()): ClearResult[] {
    return getDb().transaction((tx) => {
      const results: ClearResult[] = [];
      for (const id of questIds) {
        const result = clearOne(tx, id, clock, overrides);
        if (result) results.push(result);
      }
      return results;
    });
  },

  undo(questId: number, clock: Date = new Date()): XpAwardRow | null {
    const day = dayKey(clock);
    const removed = getDb()
      .delete(xpAward)
      .where(and(eq(xpAward.questId, questId), eq(xpAward.day, day)))
      .returning()
      .get();
    return removed ?? null;
  },
};
