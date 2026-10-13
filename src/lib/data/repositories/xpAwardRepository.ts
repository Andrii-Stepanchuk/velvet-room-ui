import { and, eq, sql } from 'drizzle-orm';

import { getDb } from '@/lib/db/client';
import { xpAward, dayLog, quest, type XpAwardRow } from '@/lib/db/schema';
import {
  addDays,
  boostsAt,
  canClearOn,
  computeAward,
  dayKey,
  deriveArcana,
  emptyTotals,
  entriesForDay,
  opensDarkHourEarly,
  parseDay,
  progressFromTotal,
  questBaseXp,
  roundHalfUp,
  statProgressFromTotals,
  streakFrom,
  tallyDay,
  type Award,
  type DayKey,
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

function chance(day: DayKey, questId: number): number {
  let h = 2166136261;
  for (const ch of `${day}:${questId}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

const HISTORY_HOURS = [7, 8, 9, 12, 13, 17, 18, 19, 21, 22] as const;

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

  seedHistory(days: number, clock: Date = new Date()): number {
    const today = dayKey(clock);
    const start = addDays(today, -days);
    return getDb().transaction((tx) => {
      const live = tx.select().from(quest).all().filter((q) => q.archivedAt === null && q.repeat === 'daily');
      if (live.length === 0) return 0;
      for (const q of live) {
        if (dayKey(q.createdAt) > start) tx.update(quest).set({ createdAt: parseDay(start) }).where(eq(quest.id, q.id)).run();
      }
      const arcanaId = deriveArcana(statProgressFromTotals(totalsFrom(tx))).id;
      let written = 0;
      for (let day = start; day < today; day = addDays(day, 1)) {
        const rest = chance(day, 0) < 0.12;
        for (const q of live) {
          if (rest || chance(day, q.id) < 0.35) continue;
          const at = parseDay(day);
          at.setHours(HISTORY_HOURS[Math.floor(chance(day, q.id * 7) * HISTORY_HOURS.length)], Math.floor(chance(day, q.id * 13) * 60));
          const boosts = boostsAt(at);
          const base = questBaseXp(q.effort, q.challenge);
          const inserted = tx
            .insert(xpAward)
            .values({
              questId: q.id,
              day,
              completedAt: at,
              stat: q.stat,
              titleSnapshot: q.title,
              baseXp: base,
              moonMult: boosts.multiplier,
              darkHour: boosts.darkHour,
              fullMoon: boosts.fullMoon,
              arcanaId,
              blessingPct: 0,
              awardedXp: roundHalfUp(base * boosts.multiplier),
            })
            .onConflictDoNothing()
            .returning({ id: xpAward.id })
            .all();
          written += inserted.length;
        }
      }
      const quests = tx.select().from(quest).all();
      const ledger = tx.select().from(xpAward).all();
      const now = new Date();
      for (let day = start; day < today; day = addDays(day, 1)) {
        const tally = tallyDay(entriesForDay(quests, ledger, day, today));
        tx.insert(dayLog)
          .values({ day, ...tally, finalizedAt: now })
          .onConflictDoUpdate({ target: dayLog.day, set: { ...tally, finalizedAt: now } })
          .run();
      }
      return written;
    });
  },
};
