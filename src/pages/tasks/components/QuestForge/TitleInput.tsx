import { memo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { CONFIG } from '@/constants/config';
import { colors } from '@/constants/theme';
import { slantOffset, withAlpha } from '@/lib/style';
import { FORGE } from '../../config/tasksLayout';

const FILL = withAlpha(colors.background[700], 0.85);
const FILL_FOCUSED = withAlpha(colors.background[700], 0.95);
const STROKE = withAlpha(colors.accent, 0.3);
const STROKE_FOCUSED = withAlpha(colors.accent, 0.7);
const PAD = slantOffset(FORGE.inputHeight, FORGE.inputSlant);
const PLATE_STYLE = { height: FORGE.inputHeight, paddingLeft: PAD + 8, paddingRight: PAD + 8 };
const INPUT_STYLE = { height: 28, paddingVertical: 0, paddingHorizontal: 2, includeFontPadding: false };

export const TitleInput = memo(function TitleInput({
  value,
  onChangeText,
  autoFocus,
}: {
  value: string;
  onChangeText: (value: string) => void;
  autoFocus: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const left = CONFIG.quests.titleMaxLength - value.length;
  return (
    <SkewPanel
      slant={FORGE.inputSlant}
      fill={focused ? FILL_FOCUSED : FILL}
      stroke={focused ? STROKE_FOCUSED : STROKE}
      className="flex-row items-center"
      style={PLATE_STYLE}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        returnKeyType="done"
        submitBehavior="blurAndSubmit"
        autoCapitalize="sentences"
        maxLength={CONFIG.quests.titleMaxLength}
        placeholder="—"
        placeholderTextColor={withAlpha(colors.textMuted, 0.6)}
        selectionColor={colors.accent}
        cursorColor={colors.accent}
        accessibilityLabel="Quest title"
        maxFontSizeMultiplier={FORGE.maxFontScale}
        className="flex-1 font-body-medium text-lg text-primary"
        style={INPUT_STYLE}
      />
      {focused && left <= 15 && (
        <View className="ml-2">
          <Text className="font-display-medium text-2xs text-tertiary">{left}</Text>
        </View>
      )}
    </SkewPanel>
  );
});
