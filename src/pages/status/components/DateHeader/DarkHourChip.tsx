import { memo } from 'react';
import { Text } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { CONFIG } from '@/constants/config';
import { colors } from '@/constants/theme';
import { formatMultiplier } from '@/lib/format';
import { withAlpha } from '@/lib/style';

const FILL = withAlpha(colors.accent, 0.15);
const STROKE = withAlpha(colors.accent, 0.5);

export const DarkHourChip = memo(function DarkHourChip() {
  return (
    <SkewPanel fill={FILL} stroke={STROKE} className="mt-2 self-start px-3.5 py-1">
      <Text className="font-display-medium text-2xs tracking-md text-accent">DARK HOUR {formatMultiplier(CONFIG.boosts.darkHour.multiplier)}</Text>
    </SkewPanel>
  );
});
