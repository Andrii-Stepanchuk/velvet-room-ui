import { memo } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/theme';
import { textShade, withAlpha } from '@/lib/style';

const LINE = [withAlpha(colors.accent, 0.5), withAlpha(colors.accent, 0)] as const;

export const SectionLabel = memo(function SectionLabel({ label, className }: { label: string; className?: string }) {
  return (
    <View accessibilityRole="header" className={`flex-row items-center gap-3 ${className ?? ''}`}>
      <Text maxFontSizeMultiplier={1.3} className="font-display text-sm tracking-md text-primary" style={textShade}>
        {label}
      </Text>
      <LinearGradient colors={LINE} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, height: 1 }} />
    </View>
  );
});
