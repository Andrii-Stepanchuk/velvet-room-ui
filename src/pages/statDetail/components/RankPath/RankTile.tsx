import { memo } from 'react';
import { Text } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { RankState } from '@/lib/game';
import { withAlpha } from '@/lib/style';
import { RANK_ROW } from '../../config/statDetailLayout';

const { tile } = RANK_ROW;
const TILE_STYLE = { width: tile.width, height: tile.height };
const LOCKED_FILL = withAlpha(colors.background[700], 0.4);
const LOCKED_STROKE = withAlpha(colors.accent, 0.2);

export const RankTile = memo(function RankTile({ rank, state, hue }: { rank: number; state: RankState; hue: string }) {
  const locked = state === 'locked';
  return (
    <SkewPanel
      slant={tile.slant}
      fill={locked ? LOCKED_FILL : hue}
      stroke={locked ? LOCKED_STROKE : undefined}
      className="items-center justify-center"
      style={TILE_STYLE}
    >
      <Text
        maxFontSizeMultiplier={RANK_ROW.maxFontScale}
        className={`font-display text-md ${locked ? 'text-disabled' : 'text-ink'}`}
      >
        {rank}
      </Text>
    </SkewPanel>
  );
});
