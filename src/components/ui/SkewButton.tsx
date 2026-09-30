import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/theme';
import { glowShadow } from '@/lib/style';

const ACTIVE_FILL = [colors.textPrimary, colors.textPrimarySoft] as const;
const ACTIVE_GLOW = glowShadow(colors.glow[500], { opacity: 0.4, radius: 26, elevation: 9, offsetY: 8 });

export function SkewButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[{ transform: [{ skewX: '-11deg' }] }, !disabled && ACTIVE_GLOW]}
    >
      <View className="overflow-hidden border border-accent/35 bg-background-600/50">
        {!disabled && (
          <LinearGradient colors={ACTIVE_FILL} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        )}
        <View className="py-4">
          <Text
            className={`text-center font-display-italic text-md tracking-xs ${disabled ? 'text-disabled' : 'text-ink'}`}
            style={{ transform: [{ skewX: '11deg' }] }}
          >
            {label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
