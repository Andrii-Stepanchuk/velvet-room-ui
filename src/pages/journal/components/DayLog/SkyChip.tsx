import { memo } from 'react';
import { Text } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { slantOffset, withAlpha } from '@/lib/style';
import { SKY_CHIP } from '../../config/dayLogLayout';

const FILL = withAlpha(colors.background[700], 0.85);
const STROKE = withAlpha(colors.accent, 0.45);
const PAD = slantOffset(SKY_CHIP.height, SKY_CHIP.slant) + 10;

export const SkyChip = memo(function SkyChip({ label }: { label: string }) {
  return (
    <SkewPanel
      slant={SKY_CHIP.slant}
      fill={FILL}
      stroke={STROKE}
      className="justify-center self-start"
      style={{ height: SKY_CHIP.height, paddingLeft: PAD, paddingRight: PAD }}
    >
      <Text numberOfLines={1} maxFontSizeMultiplier={SKY_CHIP.maxFontScale} className="font-display-medium text-2xs tracking-md text-accent">
        {label}
      </Text>
    </SkewPanel>
  );
});
