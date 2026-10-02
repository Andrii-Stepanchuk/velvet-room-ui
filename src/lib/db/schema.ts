import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import type { ArcanaId, Challenge, Effort, Repeat, StatKey } from '@/lib/game';

export const PLAYER_ID = 1;

export const player = sqliteTable('player', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export type Player = typeof player.$inferSelect;

export const quest = sqliteTable('quest', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  stat: text('stat').$type<StatKey>().notNull(),
  effort: text('effort').$type<Effort>().notNull(),
  challenge: text('challenge').$type<Challenge>().notNull(),
  repeat: text('repeat').$type<Repeat>().notNull(),
  repeatDays: integer('repeat_days').notNull().default(0),
  date: text('date'),
  note: text('note'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  archivedAt: integer('archived_at', { mode: 'timestamp_ms' }),
});

export type QuestRow = typeof quest.$inferSelect;
export type NewQuestRow = typeof quest.$inferInsert;

export const xpAward = sqliteTable(
  'xp_award',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    questId: integer('quest_id')
      .notNull()
      .references(() => quest.id),
    day: text('day').notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }).notNull(),
    stat: text('stat').$type<StatKey>().notNull(),
    titleSnapshot: text('title_snapshot').notNull(),
    baseXp: integer('base_xp').notNull(),
    moonMult: real('moon_mult').notNull(),
    darkHour: integer('dark_hour', { mode: 'boolean' }).notNull(),
    fullMoon: integer('full_moon', { mode: 'boolean' }).notNull(),
    arcanaId: text('arcana_id').$type<ArcanaId>().notNull(),
    blessingPct: real('blessing_pct').notNull(),
    awardedXp: integer('awarded_xp').notNull(),
  },
  (table) => [
    uniqueIndex('xp_award_quest_day').on(table.questId, table.day),
    index('xp_award_day').on(table.day),
    index('xp_award_stat').on(table.stat),
  ],
);

export type XpAwardRow = typeof xpAward.$inferSelect;

export const dayLog = sqliteTable('day_log', {
  day: text('day').primaryKey(),
  scheduled: integer('scheduled').notNull(),
  cleared: integer('cleared').notNull(),
  finalizedAt: integer('finalized_at', { mode: 'timestamp_ms' }).notNull(),
});

export type DayLogRow = typeof dayLog.$inferSelect;
