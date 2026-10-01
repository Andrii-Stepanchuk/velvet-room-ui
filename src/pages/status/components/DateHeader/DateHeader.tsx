import { memo } from 'react';
import { View } from 'react-native';

import { PageHeader } from '@/components/ui';
import type { Boosts } from '@/lib/game';
import { countdownCopy } from '@/lib/format';
import { DarkHourChip } from './DarkHourChip';

export const DateHeader = memo(function DateHeader({
  date,
  daysUntilFullMoon,
  boosts,
}: {
  date: Date;
  daysUntilFullMoon: number;
  boosts: Boosts;
}) {
  const { title, subtitle } = countdownCopy(daysUntilFullMoon);
  return (
    <View>
      <PageHeader date={date} title={title} subtitle={subtitle} />
      {boosts.darkHour && <DarkHourChip />}
    </View>
  );
});
