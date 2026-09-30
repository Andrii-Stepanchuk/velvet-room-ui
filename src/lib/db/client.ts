import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const sqlite = openDatabaseSync('velvet-room.db', { enableChangeListener: true });
    _db = drizzle(sqlite, { schema });
  }
  return _db;
}

export { schema };
