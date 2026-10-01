import { memo } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/theme';

const FILL = [colors.glow[500], colors.accent] as const;

export const XpBar = memo(function XpBar({ xp, fraction, toNext }: { xp: number; fraction: number; toNext: number }) {
  return (
    <View>
      <View className="h-1.5 overflow-hidden rounded-xs bg-background-900/70">
        <LinearGradient
          colors={FILL}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${fraction * 100}%`, height: '100%' }}
        />
      </View>
      <View className="mt-2 flex-row justify-between">
        <Text className="font-body-medium text-xs text-secondary">{xp} XP</Text>
        <Text className="font-body-medium text-xs text-secondary">{toNext} XP to next level</Text>
      </View>
    </View>
  );
});
