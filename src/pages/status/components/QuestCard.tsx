import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { QuestSummary } from '@/lib/game';
import { withAlpha } from '@/lib/style';

const FILL = withAlpha(colors.background[700], 0.7);
const FILL_PRESSED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.2);
const STROKE_PRESSED = withAlpha(colors.accent, 0.6);

export const QuestCard = memo(function QuestCard({
  summary,
  message,
  onPress,
}: {
  summary: QuestSummary;
  message: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Today's quests, ${summary.done} of ${summary.total} cleared. ${message}`}
      accessibilityHint="Opens Tasks"
    >
      {({ pressed }) => (
        <SkewPanel
          slant={6}
          fill={pressed ? FILL_PRESSED : FILL}
          stroke={pressed ? STROKE_PRESSED : STROKE}
          className="flex-row items-center px-7 py-4"
        >
          <Text className="font-display-italic text-xl text-accent">
            {summary.done}
            <Text className="text-tertiary">/{summary.total}</Text>
          </Text>
          <View className="ml-4 flex-1">
            <Text className="font-display-medium text-2xs tracking-lg text-secondary">TODAY&apos;S QUESTS</Text>
            <Text className="mt-1 font-body-bold text-sm text-primary">{message}</Text>
          </View>
          <Text className="font-display text-md text-accent">▸</Text>
        </SkewPanel>
      )}
    </Pressable>
  );
});
