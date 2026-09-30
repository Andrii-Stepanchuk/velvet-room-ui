import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { pixelAlignedBorderWidth } from '@/lib/style';

export const DeleteAccountButton = memo(function DeleteAccountButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="border-danger/40 bg-background-700/40 px-6 py-[11px]"
      style={{ borderWidth: pixelAlignedBorderWidth }}
    >
      <Text className="font-display-medium text-xs tracking-md text-danger">DELETE ACCOUNT</Text>
    </Pressable>
  );
});
