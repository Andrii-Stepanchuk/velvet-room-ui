import { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { STAT_DEFS, rankName, xpFraction, type StatKey, type StatProgress } from '@/lib/game';
import { slantOffset, withAlpha } from '@/lib/style';
import { STAT_PLATE } from '../../config/statsLayout';
import { StatTile } from './StatTile';
import { XpTrack } from './XpTrack';

const FILL = withAlpha(colors.background[700], 0.7);
const FILL_PRESSED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.2);
const STROKE_PRESSED = withAlpha(colors.accent, 0.6);
const PAD = slantOffset(STAT_PLATE.height, STAT_PLATE.slant) + STAT_PLATE.padX;
const PLATE_STYLE = {
  height: STAT_PLATE.height,
  paddingLeft: PAD,
  paddingRight: PAD,
};
const COLUMN_STYLE = { marginLeft: STAT_PLATE.columnGap };
const LEVEL_STYLE = { lineHeight: 36 };
const scale = STAT_PLATE.maxFontScale;

export const StatPlate = memo(function StatPlate({
  stat,
  selected,
  onOpen,
}: {
  stat: StatProgress;
  selected: boolean;
  onOpen: (stat: StatKey) => void;
}) {
  const def = STAT_DEFS[stat.key];
  const hue = colors.stat[stat.key];
  const press = useCallback(() => onOpen(stat.key), [onOpen, stat.key]);
  const ink = selected ? 'text-ink' : 'text-primary';
  const label = selected ? 'text-background-400' : 'text-muted';

  return (
    <Pressable
      onPress={press}
      accessibilityRole="button"
      accessibilityLabel={`${def.name}, rank ${stat.level}, ${rankName(stat.key, stat.level)}, ${stat.xp} of ${stat.maxXp} XP`}
      accessibilityHint="Opens the rank path"
    >
      {({ pressed }) => (
        <SkewPanel
          slant={STAT_PLATE.slant}
          fill={selected ? (pressed ? colors.textPrimarySoft : colors.textPrimary) : pressed ? FILL_PRESSED : FILL}
          stroke={selected ? undefined : pressed ? STROKE_PRESSED : STROKE}
          shadow={selected ? colors.background[700] : undefined}
          className="flex-row items-center"
          style={PLATE_STYLE}
        >
          <StatTile stat={stat.key} selected={selected} />
          <View className="flex-1" style={COLUMN_STYLE}>
            <View className="flex-row items-end justify-between">
              <Text
                numberOfLines={1}
                maxFontSizeMultiplier={scale}
                className={`flex-shrink font-display text-lg ${ink}`}
              >
                {def.name}
              </Text>
              <View className="ml-3 flex-row items-baseline">
                <Text
                  maxFontSizeMultiplier={scale}
                  className={`mr-1.5 font-display-medium text-xs tracking-xs ${label}`}
                >
                  LV
                </Text>
                <Text
                  maxFontSizeMultiplier={scale}
                  className={`font-display-italic text-xl ${ink}`}
                  style={LEVEL_STYLE}
                >
                  {stat.level}
                </Text>
              </View>
            </View>
            <View className="mt-1 flex-row items-center">
              <Text maxFontSizeMultiplier={scale} className={`mr-1.5 font-display-medium text-xs tracking-xs ${label}`}>
                XP
              </Text>
              <Text
                maxFontSizeMultiplier={scale}
                className={`mr-3 font-display-italic text-lg ${selected ? 'text-ink' : 'text-secondary'}`}
              >
                {stat.xp}
              </Text>
              <XpTrack hue={hue} fraction={xpFraction(stat)} selected={selected} />
              <Text
                maxFontSizeMultiplier={scale}
                className={`ml-3 font-display text-md ${selected ? 'text-ink' : 'text-accent'}`}
              >
                ▸
              </Text>
            </View>
          </View>
        </SkewPanel>
      )}
    </Pressable>
  );
});
