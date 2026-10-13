import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

import { useQuests } from '@/lib/data/hooks';
import { useBoostOverrides, type BoostOverrideKey } from '@/lib/state/boostOverrides';

const HISTORY_DAYS = 45;

export interface TestingRow {
  key: BoostOverrideKey;
  label: string;
  on: boolean;
}

export function useTestingRows() {
  const fullMoon = useBoostOverrides((state) => state.fullMoon);
  const darkHour = useBoostOverrides((state) => state.darkHour);
  const toggle = useBoostOverrides((state) => state.toggle);
  const { seedDemo, seedHistory } = useQuests();
  const seedQuests = useCallback(() => {
    seedDemo();
    Alert.alert('Demo quests added', 'Six daily quests are now on your Tasks list.');
  }, [seedDemo]);
  const seedJournal = useCallback(() => {
    const written = seedHistory(HISTORY_DAYS);
    Alert.alert(
      written > 0 ? 'Journal history added' : 'Nothing to seed',
      written > 0
        ? `${written} past clears across the last ${HISTORY_DAYS} days are now in your Journal.`
        : 'Seed the demo quests first, then try again.',
    );
  }, [seedHistory]);
  const rows = useMemo<readonly TestingRow[]>(
    () => [
      { key: 'fullMoon', label: 'Force Full Moon', on: fullMoon },
      { key: 'darkHour', label: 'Force Dark Hour', on: darkHour },
    ],
    [fullMoon, darkHour],
  );
  return { rows, toggle, seedQuests, seedJournal };
}
