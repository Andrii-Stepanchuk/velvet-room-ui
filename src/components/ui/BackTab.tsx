import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { EdgeTab } from './EdgeTab';
import { colors } from '@/constants/theme';

export const BackTab = memo(function BackTab({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" accessibilityLabel="Back">
      {({ pressed }) => (
        <EdgeTab side="right" fill={pressed ? colors.textPrimarySoft : colors.textPrimary} shadow={colors.background[700]}>
          <Text className="mr-2.5 font-display text-2xs text-ink">◀</Text>
          <Text className="font-display text-sm tracking-md text-ink">BACK</Text>
        </EdgeTab>
      )}
    </Pressable>
  );
});
