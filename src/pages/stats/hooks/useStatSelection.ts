import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { StatKey } from '@/lib/game';
import type { RootStackParamList } from '@/navigation/navigation.types';

export function useStatSelection(leave: (navigate: () => void) => void) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Stats'>>();
  const [selected, setSelected] = useState<StatKey>('knowledge');
  const open = useCallback(
    (stat: StatKey) => {
      setSelected(stat);
      leave(() => navigation.navigate('StatDetail', { stat }));
    },
    [leave, navigation],
  );
  return { selected, open };
}
