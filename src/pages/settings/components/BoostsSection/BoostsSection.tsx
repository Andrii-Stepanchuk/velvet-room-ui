import { Fragment, memo } from 'react';
import { View } from 'react-native';

import { SectionLabel, SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { BOOSTS_PLATE } from '../../config/settingsLayout';
import type { BoostRow } from '../../hooks/useBoostRows';
import { BoostLockup } from './BoostLockup';

const FILL = withAlpha(colors.background[700], 0.7);
const STROKE = withAlpha(colors.accent, 0.2);
const PLATE_STYLE = {
  paddingLeft: BOOSTS_PLATE.padLeft,
  paddingRight: BOOSTS_PLATE.padRight,
  paddingVertical: BOOSTS_PLATE.padY,
};
const DIVIDER_STYLE = { marginVertical: BOOSTS_PLATE.rowGap };

export const BoostsSection = memo(function BoostsSection({ rows }: { rows: readonly BoostRow[] }) {
  return (
    <View>
      <SectionLabel label="BOOSTS" className="mb-4" />
      <SkewPanel slant={BOOSTS_PLATE.slant} fill={FILL} stroke={STROKE} style={PLATE_STYLE}>
        {rows.map((row, index) => (
          <Fragment key={row.key}>
            {index > 0 && <View className="h-px bg-accent/10" style={DIVIDER_STYLE} />}
            <BoostLockup row={row} />
          </Fragment>
        ))}
      </SkewPanel>
    </View>
  );
});
