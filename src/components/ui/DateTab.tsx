import { memo } from 'react';
import { Text } from 'react-native';

import { colors } from '@/constants/theme';
import { formatDayLabel } from '@/lib/format';
import { withAlpha } from '@/lib/style';
import { EdgeTab } from './EdgeTab';

const FILL = withAlpha(colors.background[700], 0.85);
const STROKE = withAlpha(colors.accent, 0.3);

export const DateTab = memo(function DateTab({ date }: { date: Date }) {
  return (
    <EdgeTab side="left" fill={FILL} stroke={STROKE}>
      <Text className="font-display text-sm tracking-md text-accent">{formatDayLabel(date)}</Text>
    </EdgeTab>
  );
});
