import { memo } from 'react';
import { Text } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { slantOffset, withAlpha } from '@/lib/style';
import { BOOST_CHIP } from '../config/tasksLayout';

const FILL = withAlpha(colors.background[700], 0.85);
const STROKE = withAlpha(colors.accent, 0.45);
const PAD = slantOffset(BOOST_CHIP.height, BOOST_CHIP.slant) + 10;

export const BoostChip = memo(function BoostChip({ label }: { label: string }) {
  return (
    <SkewPanel
      slant={BOOST_CHIP.slant}
      fill={FILL}
      stroke={STROKE}
      className="justify-center"
      style={{ height: BOOST_CHIP.height, paddingLeft: PAD, paddingRight: PAD }}
    >
      <Text
        accessibilityLabel={`${label} live`}
        numberOfLines={1}
        maxFontSizeMultiplier={BOOST_CHIP.maxFontScale}
        className="font-display-medium text-2xs tracking-md text-accent"
      >
        {label} · LIVE
      </Text>
    </SkewPanel>
  );
});
