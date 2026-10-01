import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { usePlayer } from '@/lib/data/hooks';
import type { RootStackParamList } from '@/navigation/navigation.types';

export function useDeleteAccount(leave: (navigate: () => void) => void) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Settings'>>();
  const { remove } = usePlayer();

  return useCallback(() => {
    Alert.alert('Delete account?', 'Your name and progress will be erased from this device. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          leave(() => {
            navigation.reset({ index: 0, routes: [{ name: 'Register' }] });
            remove();
          }),
      },
    ]);
  }, [leave, navigation, remove]);
}
