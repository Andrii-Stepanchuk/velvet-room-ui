import { memo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { slantOffset, withAlpha } from '@/lib/style';
import { RENAME_FIELD } from '../../config/settingsLayout';

const FILL = withAlpha(colors.background[700], 0.85);
const FILL_FOCUSED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.3);
const STROKE_FOCUSED = withAlpha(colors.accent, 0.6);
const PAD = slantOffset(RENAME_FIELD.height, RENAME_FIELD.slant);
const PLATE_STYLE = { height: RENAME_FIELD.height, paddingLeft: PAD + 8, paddingRight: PAD + 4 };
const INPUT_STYLE = { height: RENAME_FIELD.inputHeight, paddingVertical: 0, paddingHorizontal: 2, includeFontPadding: false };
const SAVE_HIT_SLOP = { top: 4, bottom: 4, left: 8, right: 16 };

export const RenameField = memo(function RenameField({
  value,
  onChangeText,
  canSave,
  onSave,
}: {
  value: string;
  onChangeText: (value: string) => void;
  canSave: boolean;
  onSave: () => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <SkewPanel
      slant={RENAME_FIELD.slant}
      fill={focused ? FILL_FOCUSED : FILL}
      stroke={focused ? STROKE_FOCUSED : STROKE}
      className="flex-row items-center"
      style={PLATE_STYLE}
    >
      <View className="flex-1">
        <Text
          maxFontSizeMultiplier={RENAME_FIELD.maxFontScale}
          className="px-0.5 font-display-medium text-2xs leading-3 tracking-md text-accent"
        >
          NAME
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSave}
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={RENAME_FIELD.maxLength}
          placeholder="—"
          placeholderTextColor={withAlpha(colors.textMuted, 0.6)}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
          accessibilityLabel="Player name"
          maxFontSizeMultiplier={RENAME_FIELD.maxFontScale}
          className="font-display-italic text-lg tracking-xs text-primary"
          style={INPUT_STYLE}
        />
      </View>
      <View className="ml-3 h-8 w-px bg-accent/30" />
      <Pressable
        onPress={onSave}
        disabled={!canSave}
        hitSlop={SAVE_HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel="Save name"
        accessibilityState={{ disabled: !canSave }}
        className="h-12 justify-center pl-3"
      >
        <Text
          maxFontSizeMultiplier={RENAME_FIELD.maxFontScale}
          className={`font-display text-sm tracking-md ${canSave ? 'text-accent' : 'text-disabled'}`}
        >
          SAVE ▸
        </Text>
      </Pressable>
    </SkewPanel>
  );
});
