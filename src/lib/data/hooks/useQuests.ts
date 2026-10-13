import { useCallback, useMemo } from 'react';

import { useBoostOverrides } from '@/lib/state/boostOverrides';
import { xpAwardRepository, questRepository, type ClearResult, type QuestInput } from '../repositories';
import { useProgress } from './useProgress';

export function useQuests() {
  const progress = useProgress();
  const darkHour = useBoostOverrides((state) => state.darkHour);
  const fullMoon = useBoostOverrides((state) => state.fullMoon);

  const clear = useCallback(
    (ids: readonly number[]): ClearResult[] => xpAwardRepository.clear(ids, { darkHour, fullMoon }),
    [darkHour, fullMoon],
  );

  return useMemo(
    () => ({
      today: progress.today,
      quests: progress.catalog,
      ledger: progress.ledger,
      todayEntries: progress.quests,
      create: (input: QuestInput) => questRepository.create(input),
      update: (id: number, input: QuestInput) => questRepository.update(id, input),
      archive: (ids: readonly number[]) => questRepository.archive(ids),
      move: questRepository.move,
      seedDemo: questRepository.seedDemo,
      seedHistory: (days: number) => xpAwardRepository.seedHistory(days),
      clear,
      undo: (id: number) => xpAwardRepository.undo(id),
    }),
    [progress, clear],
  );
}
