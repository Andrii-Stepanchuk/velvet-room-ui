import { memo } from 'react';
import { View } from 'react-native';

import { SectionLabel } from '@/components/ui';
import type { StatKey, StatProgress } from '@/lib/game';
import { StatOrb } from './StatOrb';

export const StatRow = memo(function StatRow({
  stats,
  onOpen,
}: {
  stats: readonly StatProgress[];
  onOpen: (stat: StatKey) => void;
}) {
  return (
    <View>
      <SectionLabel label="LIFE STATS" />
      <View className="mt-4 flex-row justify-between">
        {stats.map((stat) => (
          <StatOrb key={stat.key} stat={stat} onOpen={onOpen} />
        ))}
      </View>
    </View>
  );
});
