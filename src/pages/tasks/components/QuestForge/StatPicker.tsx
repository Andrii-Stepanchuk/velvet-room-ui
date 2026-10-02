import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SkewPanel, StatIcon } from '@/components/ui';
import { colors } from '@/constants/theme';
import { STAT_DEFS, STAT_KEYS, type StatKey } from '@/lib/game';
import { withAlpha } from '@/lib/style';
import { STAT_TEXT_CLASS } from '@/lib/statStyle';
import { FORGE } from '../../config/tasksLayout';

const FILL = withAlpha(colors.background[700], 0.6);
const STROKE = withAlpha(colors.accent, 0.15);
const BOX = { height: 64 };

export const StatPicker = memo(function StatPicker({ value, onChange }: { value: StatKey; onChange: (stat: StatKey) => void }) {
  return (
    <View className="flex-row gap-1.5" accessibilityRole="radiogroup" accessibilityLabel="Life stat">
      {STAT_KEYS.map((key) => {
        const selected = key === value;
        const hue = colors.stat[key];
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            className="flex-1"
            accessibilityRole="radio"
            accessibilityLabel={STAT_DEFS[key].name}
            accessibilityState={{ selected }}
          >
            <SkewPanel
              slant={8}
              fill={selected ? withAlpha(colors.background[700], 0.95) : FILL}
              stroke={selected ? hue : STROKE}
              className="items-center justify-center"
              style={BOX}
            >
              <StatIcon stat={key} size={22} color={selected ? hue : withAlpha(hue, 0.7)} />
              <Text
                maxFontSizeMultiplier={FORGE.maxFontScale}
                className={`mt-1.5 font-display text-2xs tracking-xs ${selected ? STAT_TEXT_CLASS[key] : 'text-tertiary'}`}
              >
                {STAT_DEFS[key].abbr}
              </Text>
            </SkewPanel>
          </Pressable>
        );
      })}
    </View>
  );
});
