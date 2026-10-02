import { memo, useState } from 'react';
import { TextInput } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { CONFIG } from '@/constants/config';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { FORGE } from '../../config/tasksLayout';

const FILL = withAlpha(colors.background[700], 0.7);
const STROKE = withAlpha(colors.accent, 0.2);
const STROKE_FOCUSED = withAlpha(colors.accent, 0.6);
const INPUT_STYLE = { minHeight: FORGE.noteHeight - 24, paddingVertical: 0, textAlignVertical: 'top' as const };

export const NoteInput = memo(function NoteInput({ value, onChangeText }: { value: string; onChangeText: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <SkewPanel slant={4} fill={FILL} stroke={focused ? STROKE_FOCUSED : STROKE} className="px-5 py-3">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        maxLength={CONFIG.quests.noteMaxLength}
        placeholder="Why it matters, or how you'll know it's done."
        placeholderTextColor={withAlpha(colors.textMuted, 0.6)}
        selectionColor={colors.accent}
        cursorColor={colors.accent}
        accessibilityLabel="Note"
        maxFontSizeMultiplier={1.3}
        className="font-body text-md text-primary"
        style={INPUT_STYLE}
      />
    </SkewPanel>
  );
});
