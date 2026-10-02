import { createContext, useEffect, useMemo, type ReactNode } from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useToday } from '@/hooks/useToday';
import { xpAwardRepository, dayLogRepository, questRepository } from '../repositories';
import { buildProgress, type Progress } from './buildProgress';

export const ProgressContext = createContext<Progress | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const today = useToday();
  const quests = useLiveQuery(questRepository.query());
  const ledger = useLiveQuery(xpAwardRepository.query());
  const dayLogs = useLiveQuery(dayLogRepository.query());
  if (quests.error) throw quests.error;
  if (ledger.error) throw ledger.error;
  if (dayLogs.error) throw dayLogs.error;

  useEffect(() => {
    dayLogRepository.finalizeThrough(today);
  }, [today]);

  const value = useMemo(
    () => buildProgress(quests.data, ledger.data, dayLogs.data, today),
    [quests.data, ledger.data, dayLogs.data, today],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
