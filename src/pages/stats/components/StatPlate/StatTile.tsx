import { memo } from 'react';

import { SkewPanel, StatIcon } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { StatKey } from '@/lib/game';
import { withAlpha } from '@/lib/style';
import { STAT_TILE } from '../../config/statsLayout';

const TILE_STYLE = { width: STAT_TILE.size, height: STAT_TILE.size };

export const StatTile = memo(function StatTile({ stat, selected }: { stat: StatKey; selected: boolean }) {
  const hue = colors.stat[stat];
  return (
    <SkewPanel
      slant={STAT_TILE.slant}
      fill={selected ? colors.ink : withAlpha(hue, 0.18)}
      stroke={selected ? undefined : withAlpha(hue, 0.5)}
      className="items-center justify-center"
      style={TILE_STYLE}
    >
      <StatIcon stat={stat} size={STAT_TILE.icon} color={hue} />
    </SkewPanel>
  );
});
