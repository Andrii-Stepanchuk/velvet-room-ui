import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const PLAYER_ID = 1;

export const player = sqliteTable('player', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export type Player = typeof player.$inferSelect;
