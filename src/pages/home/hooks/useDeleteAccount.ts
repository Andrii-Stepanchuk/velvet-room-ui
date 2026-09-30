import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/navigation.types';

export function useDeleteAccount(removePlayer: () => void) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();

  return useCallback(() => {
    Alert.alert('Delete account?', 'Your name and progress will be erased from this device. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removePlayer();
          navigation.reset({ index: 0, routes: [{ name: 'Register' }] });
        },
      },
    ]);
  }, [navigation, removePlayer]);
}
