import { memo } from 'react';
import Animated, { type SharedValue } from 'react-native-reanimated';

import { useAmbientBubbleStyle, type AmbientSpec } from '../../hooks/useBubbles';
import { BubbleSphere } from './BubbleSphere';

export const AmbientBubble = memo(function AmbientBubble({
  spec,
  clock,
  width,
  height,
}: {
  spec: AmbientSpec;
  clock: SharedValue<number>;
  width: number;
  height: number;
}) {
  const style = useAmbientBubbleStyle(spec, clock, height);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', left: spec.leftFraction * width, bottom: 0, width: spec.sizePx, height: spec.sizePx },
        style,
      ]}
    >
      <BubbleSphere size={spec.sizePx} />
    </Animated.View>
  );
});
