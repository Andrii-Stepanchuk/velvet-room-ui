import { StyleSheet, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import { colors, radius } from '@/constants/theme';
import { glowShadow, withAlpha } from '@/lib/style';
import { useFocusRing } from '@/hooks/useFocusRing';

const FILL = [withAlpha(colors.background[600], 0.8), withAlpha(colors.background[700], 0.7)] as const;
const UNDERLINE = [withAlpha(colors.accent, 0), withAlpha(colors.accent, 0.85), withAlpha(colors.accent, 0)] as const;
const FOCUS_RING = {
  ...StyleSheet.absoluteFill,
  margin: -1,
  borderWidth: 1,
  borderColor: colors.accent,
  borderRadius: radius.xs,
  ...glowShadow(colors.accent, { opacity: 0.28, radius: 20, elevation: 6 }),
};

export function NameInput({
  value,
  onChangeText,
  className,
}: {
  value: string;
  onChangeText: (value: string) => void;
  className?: string;
}) {
  const { ringStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View className={`relative rounded-xs border border-accent/30 ${className ?? ''}`}>
      {/* Restyling the wrapper on focus re-creates the native input and drops focus, so the
          ring is a separate overlay. It comes first so its glow stays beneath the fill. */}
      <Animated.View pointerEvents="none" style={[FOCUS_RING, ringStyle]} />
      <LinearGradient colors={FILL} style={[StyleSheet.absoluteFill, { borderRadius: radius.xs }]} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType="done"
        submitBehavior="blurAndSubmit"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={18}
        placeholder="—"
        placeholderTextColor={withAlpha(colors.textMuted, 0.5)}
        selectionColor={colors.accent}
        className="px-[18px] py-[17px] text-center font-display text-lg tracking-md text-primary"
      />
      <LinearGradient
        colors={UNDERLINE}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2 }}
      />
    </View>
  );
}
