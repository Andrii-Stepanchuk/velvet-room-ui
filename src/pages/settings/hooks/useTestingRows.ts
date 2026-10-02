import { useMemo } from 'react';

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
  const rows = useMemo<readonly TestingRow[]>(
    () => [
      { key: 'fullMoon', label: 'Force Full Moon', on: fullMoon },
      { key: 'darkHour', label: 'Force Dark Hour', on: darkHour },
    ],
    [fullMoon, darkHour],
  );
  return { rows, toggle };
}
