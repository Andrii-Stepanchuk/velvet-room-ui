import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';

export const MenuButton = memo(function MenuButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" accessibilityLabel="Open menu">
      <SkewPanel fill={colors.textPrimary} className="px-6 py-2.5">
        <Text className="font-display-italic text-sm tracking-sm text-ink">MENU ▸</Text>
      </SkewPanel>
    </Pressable>
  );
});
