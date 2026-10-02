import { memo } from 'react';
import { Pressable, View } from 'react-native';
import Check from 'lucide-react-native/icons/check';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { QUEST_ROW } from '../../config/tasksLayout';

const OPEN_FILL = withAlpha(colors.background[700], 0.6);
const OPEN_STROKE = withAlpha(colors.accent, 0.45);
const OPEN_STROKE_PRESSED = withAlpha(colors.accent, 0.85);
const LOCKED_STROKE = withAlpha(colors.accent, 0.15);
const BOX = { width: QUEST_ROW.check, height: QUEST_ROW.check };
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 8 };

export const CheckPlate = memo(function CheckPlate({
  checked,
  hue,
  disabled,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  role = 'checkbox',
}: {
  checked: boolean;
  hue: string;
  disabled: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  role?: 'checkbox' | 'none';
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole={role === 'checkbox' ? 'checkbox' : undefined}
      accessible={role === 'checkbox'}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ checked, disabled }}
    >
      {({ pressed }) => (
        <SkewPanel
          slant={QUEST_ROW.checkSlant}
          fill={checked ? hue : OPEN_FILL}
          stroke={checked ? undefined : disabled ? LOCKED_STROKE : pressed ? OPEN_STROKE_PRESSED : OPEN_STROKE}
          className="items-center justify-center"
          style={BOX}
        >
          {checked ? (
            <Check size={QUEST_ROW.checkIcon} color={colors.ink} strokeWidth={3} />
          ) : (
            <View style={BOX} />
          )}
        </SkewPanel>
      )}
    </Pressable>
  );
});
