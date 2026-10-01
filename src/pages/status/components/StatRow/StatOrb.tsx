import { memo } from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { STAT_DEFS, xpFraction, type StatProgress } from '@/lib/game';
import { withAlpha } from '@/lib/style';
import { STAT_ORB } from '../../config/statusLayout';
import { ProgressRing } from '../ProgressRing';
import { StatIcon } from './StatIcon';

const INNER = STAT_ORB.size - STAT_ORB.inset;

export const StatOrb = memo(function StatOrb({ stat }: { stat: StatProgress }) {
  const hue = colors.stat[stat.key];
  return (
    <View className="items-center" accessible accessibilityLabel={`${STAT_DEFS[stat.key].name} level ${stat.level}`}>
      <View style={{ width: STAT_ORB.size, height: STAT_ORB.size }} className="items-center justify-center">
        <ProgressRing
          size={STAT_ORB.size}
          strokeWidth={STAT_ORB.ring}
          progress={xpFraction(stat)}
          color={hue}
          trackColor={withAlpha(hue, 0.18)}
        />
        <View style={{ width: INNER, height: INNER }} className="items-center justify-center rounded-full bg-background-700/80">
          <StatIcon stat={stat.key} size={STAT_ORB.icon} color={hue} />
        </View>
      </View>
      <Text className="mt-2 font-display text-md text-primary">{stat.level}</Text>
    </View>
  );
});
