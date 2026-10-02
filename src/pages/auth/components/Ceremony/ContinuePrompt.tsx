import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { textShade } from '@/lib/style';
import { useContinuePrompt } from '../../hooks/useContinuePrompt';

export const ContinuePrompt = memo(function ContinuePrompt({
  active,
  visible,
  onPress,
  bottom,
}: {
  active: boolean;
  visible: boolean;
  onPress: () => void;
  bottom: number;
}) {
  const { fade, label } = useContinuePrompt(visible);

  return (
    <Pressable
      disabled={!active}
      pointerEvents={active ? 'auto' : 'none'}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Continue"
      style={StyleSheet.absoluteFill}
    >
      <Animated.View style={[{ position: 'absolute', left: 0, right: 0, bottom, alignItems: 'center' }, fade]}>
        <Animated.View style={label}>
          <Text
            maxFontSizeMultiplier={1.15}
            className="font-display text-sm tracking-md text-primary"
            style={textShade}
          >
            CONTINUE <Text className="text-accent">▸</Text>
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
});
