import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import Plus from 'lucide-react-native/icons/plus';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { ADD_PLATE } from '../config/tasksLayout';

const FILL = withAlpha(colors.background[700], 0.55);
const FILL_PRESSED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.5);
const STROKE_PRESSED = withAlpha(colors.accent, 0.85);

export const AddQuestPlate = memo(function AddQuestPlate({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Add quest" accessibilityHint="Opens the Quest Forge">
      {({ pressed }) => (
        <SkewPanel
          slant={ADD_PLATE.slant}
          fill={pressed ? FILL_PRESSED : FILL}
          stroke={pressed ? STROKE_PRESSED : STROKE}
          dashed
          className="flex-row items-center justify-center"
          style={{ height: ADD_PLATE.height }}
        >
          <Plus size={ADD_PLATE.icon} color={colors.accent} strokeWidth={2.4} />
          <Text maxFontSizeMultiplier={1.15} className="ml-2.5 font-display text-sm tracking-lg text-primary">
            ADD QUEST
          </Text>
        </SkewPanel>
      )}
    </Pressable>
  );
});
