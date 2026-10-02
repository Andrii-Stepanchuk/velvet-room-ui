import { memo } from 'react';
import { Text } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';

import type { StatProgress } from '@/lib/game';
import { textShade } from '@/lib/style';
import { STATS_GAP } from '../config/statsLayout';
import { useStatsLayer } from '../hooks/useStatsLayer';

export const StatsHint = memo(function StatsHint({
  stats,
  progress,
}: {
  stats: readonly StatProgress[];
  progress: SharedValue<number>;
}) {
  const style = useStatsLayer(progress, stats.length);
  return (
    <Animated.View style={[{ marginTop: STATS_GAP.hint }, style]}>
      <Text maxFontSizeMultiplier={1.3} className="font-body-medium text-sm text-secondary" style={textShade}>
        Tap a stat to view its rank path.
      </Text>
    </Animated.View>
  );
});
