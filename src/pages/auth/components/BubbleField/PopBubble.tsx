import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';

import { POP_SIZE, usePopBubbleStyle, type PopPool } from '../../hooks/useBubbles';
import { BubbleSphere } from './BubbleSphere';

export const PopBubble = memo(function PopBubble({
  index,
  pops,
  clock,
}: {
  index: number;
  pops: PopPool;
  clock: SharedValue<number>;
}) {
  const style = usePopBubbleStyle(index, pops, clock);

  return (
    <Animated.View pointerEvents="none" style={[styles.pop, style]}>
      <BubbleSphere size={POP_SIZE} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  pop: { position: 'absolute', left: 0, top: 0, width: POP_SIZE, height: POP_SIZE },
});
