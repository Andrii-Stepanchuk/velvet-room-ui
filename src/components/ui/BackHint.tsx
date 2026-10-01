import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { pixelAlignedBorderWidth } from '@/lib/style';

const DIAMOND = { transform: [{ rotate: '45deg' }], borderWidth: pixelAlignedBorderWidth };

export const BackHint = memo(function BackHint({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Back"
      className="flex-row items-center self-end px-5 py-2"
    >
      <View className="mr-2.5 h-2.5 w-2.5 border-secondary" style={DIAMOND} />
      <Text className="font-display-medium text-xs tracking-md text-secondary">BACK</Text>
    </Pressable>
  );
});
