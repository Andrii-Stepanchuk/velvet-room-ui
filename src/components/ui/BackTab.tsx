import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { EdgeTab } from './EdgeTab';
import { colors } from '@/constants/theme';
import { pixelAlignedBorderWidth, withAlpha } from '@/lib/style';

const FILL = withAlpha(colors.background[700], 0.9);
const STROKE = withAlpha(colors.accent, 0.3);
const DIAMOND = {
  transform: [{ rotate: '45deg' }],
  borderWidth: pixelAlignedBorderWidth,
};

export const BackTab = memo(function BackTab({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" accessibilityLabel="Back">
      <EdgeTab side="right" fill={FILL} stroke={STROKE}>
        <View className="mr-2.5 h-2.5 w-2.5 border-secondary" style={DIAMOND} />
        <Text className="font-display text-sm tracking-md text-secondary">BACK</Text>
      </EdgeTab>
    </Pressable>
  );
});
