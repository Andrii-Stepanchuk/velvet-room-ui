import { memo, type ReactNode } from 'react';
import Animated, { type SharedValue } from 'react-native-reanimated';

import { useDealtRow } from '../../hooks/useDaySwap';

export const DealtRow = memo(function DealtRow({
  deal,
  index,
  count,
  children,
}: {
  deal: SharedValue<number>;
  index: number;
  count: number;
  children: ReactNode;
}) {
  const style = useDealtRow(deal, index, count);
  return <Animated.View style={style}>{children}</Animated.View>;
});
