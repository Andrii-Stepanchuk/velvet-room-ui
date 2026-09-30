import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { usePlayer } from '@/lib/data/hooks';
import type { RootStackParamList } from '@/navigation/navigation.types';

export function usePlayerRegistration() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Register'>>();

  const { saveName } = usePlayer();
  const enterHome = useCallback(() => navigation.replace('Home'), [navigation]);

  return { register: saveName, enterHome };
}
