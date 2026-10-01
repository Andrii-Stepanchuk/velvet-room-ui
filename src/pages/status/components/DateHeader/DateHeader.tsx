import { memo } from 'react';

import { PageHeader } from '@/components/ui';
import type { Boosts } from '@/lib/game';
import { headerCopy } from '@/lib/format';

export const DateHeader = memo(function DateHeader({
  date,
  daysUntilFullMoon,
  boosts,
}: {
  date: Date;
  daysUntilFullMoon: number;
  boosts: Boosts;
}) {
  const { title, subtitle } = headerCopy(daysUntilFullMoon, boosts);
  return <PageHeader date={date} title={title} subtitle={subtitle} />;
});
