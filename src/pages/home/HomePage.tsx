import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlayer } from '@/lib/data/hooks';
import { textGlow } from '@/lib/style';
import { DeleteAccountButton } from './components/DeleteAccountButton';
import { useDeleteAccount } from './hooks/useDeleteAccount';

const NAME_STYLE = [{ transform: [{ skewX: '-6deg' }] }, textGlow];

export function HomePage() {
  const insets = useSafeAreaInsets();
  const { player, remove } = usePlayer();
  const deleteAccount = useDeleteAccount(remove);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-display-medium text-xs tracking-xl text-secondary">WELCOME BACK</Text>
      <Text className="mt-2 font-display-italic text-2xl tracking-sm text-white" style={NAME_STYLE}>
        {player?.name.toUpperCase()}
      </Text>

      <View style={[styles.bottom, { bottom: insets.bottom + 28 }]}>
        <DeleteAccountButton onPress={deleteAccount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
});
