import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { MONTH_SHEET } from '../../config/monthSheetLayout';

const FILL = withAlpha(colors.background[700], 0.4);
const FILL_PRESSED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.3);
const STROKE_PRESSED = withAlpha(colors.accent, 0.6);
const STROKE_DISABLED = withAlpha(colors.accent, 0.12);

export const MonthStep = memo(function MonthStep({
  direction,
  disabled,
  onPress,
}: {
  direction: -1 | 1;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={direction < 0 ? 'Previous month' : 'Next month'}
      accessibilityState={{ disabled }}
    >
      {({ pressed }) => (
        <SkewPanel
          slant={MONTH_SHEET.stepSlant}
          fill={pressed ? FILL_PRESSED : FILL}
          stroke={disabled ? STROKE_DISABLED : pressed ? STROKE_PRESSED : STROKE}
          className="items-center justify-center"
          style={{ width: MONTH_SHEET.stepSize + 8, height: MONTH_SHEET.stepSize }}
        >
          <Text
            maxFontSizeMultiplier={MONTH_SHEET.maxFontScale}
            className={`font-display text-xs ${disabled ? 'text-disabled' : 'text-primary'}`}
          >
            {direction < 0 ? '◀' : '▶'}
          </Text>
        </SkewPanel>
      )}
    </Pressable>
  );
});
