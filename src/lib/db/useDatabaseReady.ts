import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import migrations from '../../../drizzle/migrations';
import { getDb } from './client';

export function useDatabaseReady() {
  const { success, error } = useMigrations(getDb(), migrations);
  return { ready: success, error };
}
