import { and, asc, eq, inArray, isNull } from 'drizzle-orm';

import { CONFIG } from '@/constants/config';
import { getDb } from '@/lib/db/client';
import { quest, type QuestRow } from '@/lib/db/schema';
import type { Challenge, DayKey, Effort, Repeat, StatKey } from '@/lib/game';
import { DEMO_QUESTS } from '../seed';

export interface QuestInput {
  title: string;
  stat: StatKey;
  effort: Effort;
  challenge: Challenge;
  repeat: Repeat;
  repeatDays: number;
  date: DayKey | null;
  note: string | null;
}

function clean(input: QuestInput): QuestInput {
  const note = input.note?.trim().slice(0, CONFIG.quests.noteMaxLength) ?? '';
  return {
    ...input,
    title: input.title.trim().slice(0, CONFIG.quests.titleMaxLength),
    repeatDays: input.repeat === 'days' ? input.repeatDays : 0,
    date: input.repeat === 'once' ? input.date : null,
    note: note.length > 0 ? note : null,
  };
}

export const questRepository = {
  query() {
    return getDb().select().from(quest).orderBy(asc(quest.id));
  },

  all(): QuestRow[] {
    return questRepository.query().all();
  },

  get(id: number): QuestRow | undefined {
    return getDb().select().from(quest).where(eq(quest.id, id)).get();
  },

  create(input: QuestInput): number {
    const now = new Date();
    const row = getDb()
      .insert(quest)
      .values({ ...clean(input), createdAt: now, updatedAt: now })
      .returning({ id: quest.id })
      .get();
    return row.id;
  },

  update(id: number, input: QuestInput): void {
    getDb()
      .update(quest)
      .set({ ...clean(input), updatedAt: new Date() })
      .where(eq(quest.id, id))
      .run();
  },

  archive(ids: readonly number[]): void {
    if (ids.length === 0) return;
    const now = new Date();
    getDb()
      .update(quest)
      .set({ archivedAt: now, updatedAt: now })
      .where(and(inArray(quest.id, [...ids]), isNull(quest.archivedAt)))
      .run();
  },

  move(ids: readonly number[], date: DayKey): void {
    if (ids.length === 0) return;
    getDb()
      .update(quest)
      .set({ date, updatedAt: new Date() })
      .where(and(inArray(quest.id, [...ids]), eq(quest.repeat, 'once')))
      .run();
  },

  seedDemo(): void {
    const db = getDb();
    const now = new Date();
    db.transaction((tx) => {
      for (const demo of DEMO_QUESTS) {
        tx.insert(quest)
          .values({ ...demo, repeatDays: 0, date: null, note: null, createdAt: now, updatedAt: now })
          .run();
      }
    });
  },
};
