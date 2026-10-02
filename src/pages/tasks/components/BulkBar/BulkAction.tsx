import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { BULK_BAR } from '../../config/tasksLayout';

const FILL = withAlpha(colors.background[700], 0.4);
const FILL_PRESSED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.3);
const STROKE_PRESSED = withAlpha(colors.accent, 0.6);
const DANGER_STROKE = withAlpha(colors.danger, 0.4);
const DANGER_STROKE_PRESSED = withAlpha(colors.danger, 0.7);

export const BulkAction = memo(function BulkAction({
  label,
  onPress,
  disabled = false,
  danger = false,
  primary = false,
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
  primary?: boolean;
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="flex-1"
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      {({ pressed }) => {
        const stroke = danger ? (pressed ? DANGER_STROKE_PRESSED : DANGER_STROKE) : pressed ? STROKE_PRESSED : STROKE;
        const text = disabled ? 'text-disabled' : danger ? 'text-danger' : primary ? 'text-accent' : 'text-primary';
        return (
          <SkewPanel
            slant={BULK_BAR.actionSlant}
            fill={pressed ? FILL_PRESSED : FILL}
            stroke={disabled ? withAlpha(colors.accent, 0.12) : stroke}
            className="items-center justify-center"
            style={{ height: BULK_BAR.actionHeight }}
          >
            <Text maxFontSizeMultiplier={1.15} numberOfLines={1} className={`font-display text-sm tracking-sm ${text}`}>
              {label}
            </Text>
          </SkewPanel>
        );
      }}
    </Pressable>
  );
});
