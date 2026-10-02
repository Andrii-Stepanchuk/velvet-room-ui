import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { slantOffset, withAlpha } from '@/lib/style';
import { FILTER_CHIP } from '../config/tasksLayout';

const FILL = withAlpha(colors.background[700], 0.85);
const FILL_PRESSED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.25);
const PAD = slantOffset(FILTER_CHIP.height, FILTER_CHIP.slant) + 8;
const HIT_SLOP = { top: 6, bottom: 6 };

export const FilterChip = memo(function FilterChip({
  label,
  active,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: active }}
    >
      {({ pressed }) => (
        <SkewPanel
          slant={FILTER_CHIP.slant}
          fill={active ? colors.accent : pressed ? FILL_PRESSED : FILL}
          stroke={active ? undefined : STROKE}
          className="flex-row items-center"
          style={{ height: FILTER_CHIP.height, paddingLeft: PAD, paddingRight: PAD }}
        >
          <Text
            maxFontSizeMultiplier={FILTER_CHIP.maxFontScale}
            className={`font-display text-2xs tracking-md ${active ? 'text-ink' : 'text-secondary'}`}
          >
            {label}
          </Text>
        </SkewPanel>
      )}
    </Pressable>
  );
});
