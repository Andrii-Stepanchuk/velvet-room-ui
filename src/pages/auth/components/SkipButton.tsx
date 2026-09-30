import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { useVisibilityFade } from '../hooks/useVisibilityFade';

export const SkipButton = memo(function SkipButton({
  visible,
  onPress,
  bottom,
}: {
  visible: boolean;
  onPress: () => void;
  bottom: number;
}) {
  const style = useVisibilityFade(visible);

  return (
    <Animated.View
      pointerEvents={visible ? 'box-none' : 'none'}
      style={[{ position: 'absolute', left: 0, right: 0, bottom, alignItems: 'center' }, style]}
    >
      <Pressable onPress={onPress} className="border border-accent/30 bg-background-700/40 px-6 py-[11px]">
        <Text className="font-display-medium text-xs tracking-md text-secondary">SKIP ▸</Text>
      </Pressable>
    </Animated.View>
  );
});
