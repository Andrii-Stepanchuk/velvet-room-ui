import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

import { useQuests } from '@/lib/data/hooks';
import { useBoostOverrides, type BoostOverrideKey } from '@/lib/state/boostOverrides';

export interface TestingRow {
  key: BoostOverrideKey;
  label: string;
  on: boolean;
}

export function useTestingRows() {
  const fullMoon = useBoostOverrides((state) => state.fullMoon);
  const darkHour = useBoostOverrides((state) => state.darkHour);
  const toggle = useBoostOverrides((state) => state.toggle);
  const { seedDemo } = useQuests();
  const seedQuests = useCallback(() => {
    seedDemo();
    Alert.alert('Demo quests added', 'Six daily quests are now on your Tasks list.');
  }, [seedDemo]);
  const rows = useMemo<readonly TestingRow[]>(
    () => [
      { key: 'fullMoon', label: 'Force Full Moon', on: fullMoon },
      { key: 'darkHour', label: 'Force Dark Hour', on: darkHour },
    ],
    [fullMoon, darkHour],
  );
  return { rows, toggle, seedQuests };
}
