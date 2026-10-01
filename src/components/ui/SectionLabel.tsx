import { memo } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';

const LINE = [withAlpha(colors.accent, 0.5), withAlpha(colors.accent, 0)] as const;

export const SectionLabel = memo(function SectionLabel({ label, className }: { label: string; className?: string }) {
  return (
    <View className={`flex-row items-center gap-3 ${className ?? ''}`}>
      <Text className="font-display-medium text-xs tracking-lg text-primary">{label}</Text>
      <LinearGradient colors={LINE} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, height: 1 }} />
    </View>
  );
});
