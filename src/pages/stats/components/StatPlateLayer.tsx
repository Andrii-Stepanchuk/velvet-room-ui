import { memo } from 'react';
import Animated, { type SharedValue } from 'react-native-reanimated';

import type { StatKey, StatProgress } from '@/lib/game';
import { STATS_GAP } from '../config/statsLayout';
import { useStatsLayer } from '../hooks/useStatsLayer';
import { StatPlate } from './StatPlate/StatPlate';

export const StatPlateLayer = memo(function StatPlateLayer({
  stat,
  index,
  selected,
  progress,
  onOpen,
}: {
  stat: StatProgress;
  index: number;
  selected: boolean;
  progress: SharedValue<number>;
  onOpen: (stat: StatKey) => void;
}) {
  const style = useStatsLayer(progress, index);
  return (
    <Animated.View style={[index > 0 && { marginTop: STATS_GAP.plate }, style]}>
      <StatPlate stat={stat} selected={selected} onOpen={onOpen} />
    </Animated.View>
  );
});
