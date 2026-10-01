import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/navigation.types';

export function useEntranceReplay(leave: (navigate: () => void) => void) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Settings'>>();
  return useCallback(
    () => leave(() => navigation.reset({ index: 0, routes: [{ name: 'Register', params: { replay: true } }] })),
    [leave, navigation],
  );
}
