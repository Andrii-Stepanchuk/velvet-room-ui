import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';

const FADE_IN = [withAlpha(colors.accent, 0), withAlpha(colors.accent, 0.45)] as const;
const FADE_OUT = [withAlpha(colors.accent, 0.45), withAlpha(colors.accent, 0)] as const;

export function AccentDivider({ label, className }: { label: string; className?: string }) {
  return (
    <View className={`flex-row items-center gap-2.5 ${className ?? ''}`}>
      <LinearGradient colors={FADE_IN} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, height: 1 }} />
      <Text className="font-display-medium text-2xs tracking-lg text-muted">{label}</Text>
      <LinearGradient colors={FADE_OUT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, height: 1 }} />
    </View>
  );
}
