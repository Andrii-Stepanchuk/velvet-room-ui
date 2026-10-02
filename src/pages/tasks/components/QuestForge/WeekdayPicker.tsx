import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { WEEKDAY_ORDER, hasWeekday, toggleWeekday } from '@/lib/game';
import { withAlpha } from '@/lib/style';
import { FORGE } from '../../config/tasksLayout';

const LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const FILL = withAlpha(colors.background[700], 0.6);
const STROKE = withAlpha(colors.accent, 0.25);

export const WeekdayPicker = memo(function WeekdayPicker({ mask, onChange }: { mask: number; onChange: (mask: number) => void }) {
  return (
    <View className="flex-row gap-1.5">
      {WEEKDAY_ORDER.map((day) => {
        const on = hasWeekday(mask, day);
        return (
          <Pressable
            key={day}
            onPress={() => onChange(toggleWeekday(mask, day))}
            className="flex-1"
            accessibilityRole="checkbox"
            accessibilityLabel={NAMES[day]}
            accessibilityState={{ checked: on }}
          >
            <SkewPanel
              slant={12}
              fill={on ? colors.accent : FILL}
              stroke={on ? undefined : STROKE}
              className="items-center justify-center"
              style={{ height: FORGE.weekdayChip }}
            >
              <Text maxFontSizeMultiplier={FORGE.maxFontScale} className={`font-display text-sm ${on ? 'text-ink' : 'text-secondary'}`}>
                {LETTERS[day]}
              </Text>
            </SkewPanel>
          </Pressable>
        );
      })}
    </View>
  );
});
