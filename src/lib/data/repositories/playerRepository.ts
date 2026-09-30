import { eq } from 'drizzle-orm';

import { getDb } from '@/lib/db/client';
import { PLAYER_ID, player, type Player } from '@/lib/db/schema';

export const playerRepository = {
  query() {
    return getDb().select().from(player).where(eq(player.id, PLAYER_ID));
  },

  get(): Player | undefined {
    return playerRepository.query().get();
  },

  saveName(name: string): void {
    const now = new Date();
    getDb()
      .insert(player)
      .values({ id: PLAYER_ID, name, createdAt: now, updatedAt: now })
      .onConflictDoUpdate({ target: player.id, set: { name, updatedAt: now } })
      .run();
  },

  delete(): void {
    getDb().delete(player).where(eq(player.id, PLAYER_ID)).run();
  },
};
