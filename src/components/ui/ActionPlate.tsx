import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { ACTION_PLATE } from '@/constants/layout';
import { colors } from '@/constants/theme';
import { slantOffset, withAlpha } from '@/lib/style';
import { SkewPanel } from './SkewPanel';

const FILL = withAlpha(colors.background[700], 0.4);
const FILL_PRESSED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.3);
const STROKE_PRESSED = withAlpha(colors.accent, 0.6);
const DANGER_STROKE = withAlpha(colors.danger, 0.4);
const DANGER_STROKE_PRESSED = withAlpha(colors.danger, 0.7);
const PAD = slantOffset(ACTION_PLATE.height, ACTION_PLATE.slant) + ACTION_PLATE.padX;
const PLATE_STYLE = { height: ACTION_PLATE.height, paddingLeft: PAD, paddingRight: PAD };

export const ActionPlate = memo(function ActionPlate({
  label,
  onPress,
  danger = false,
  chevron = false,
  disabled = false,
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
  chevron?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      className="self-start"
    >
      {({ pressed }) => (
        <SkewPanel
          slant={ACTION_PLATE.slant}
          fill={pressed ? FILL_PRESSED : FILL}
          stroke={danger ? (pressed ? DANGER_STROKE_PRESSED : DANGER_STROKE) : pressed ? STROKE_PRESSED : STROKE}
          className="flex-row items-center"
          style={PLATE_STYLE}
        >
          <Text
            maxFontSizeMultiplier={ACTION_PLATE.maxFontScale}
            className={`font-display text-sm tracking-md ${disabled ? 'text-disabled' : danger ? 'text-danger' : 'text-primary'}`}
          >
            {label}
          </Text>
          {chevron && (
            <Text maxFontSizeMultiplier={ACTION_PLATE.maxFontScale} className="ml-3 font-display text-md text-accent">
              ▸
            </Text>
          )}
        </SkewPanel>
      )}
    </Pressable>
  );
});
