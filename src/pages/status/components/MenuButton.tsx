import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';

export const MenuButton = memo(function MenuButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" accessibilityLabel="Open menu">
      {({ pressed }) => (
        <SkewPanel
          fill={pressed ? colors.textPrimarySoft : colors.textPrimary}
          shadow={colors.background[700]}
          className="min-h-11 flex-row items-center px-6"
        >
          <Text className="font-display text-sm tracking-sm text-ink">MENU</Text>
          <Text className="ml-2 font-display text-2xs text-ink">▶</Text>
        </SkewPanel>
      )}
    </Pressable>
  );
});
