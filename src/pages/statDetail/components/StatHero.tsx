import { memo } from 'react';
import { Text, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { ProgressRing, StatIcon } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { StatDef, StatProgress } from '@/lib/game';
import { textShade, withAlpha } from '@/lib/style';
import { STAT_HERO } from '../config/statDetailLayout';

const RING_STYLE = { width: STAT_HERO.ring, height: STAT_HERO.ring };
const WELL = STAT_HERO.ring - STAT_HERO.inset * 2;
const WELL_STYLE = { width: WELL, height: WELL };
const COLUMN_STYLE = { marginLeft: STAT_HERO.gap };
const NAME_STYLE = [textShade, { lineHeight: 40 }];
const scale = STAT_HERO.maxFontScale;

export const StatHero = memo(function StatHero({
  stat,
  def,
  rank,
  nextRank,
  fraction,
  toNext,
  sweep,
}: {
  stat: StatProgress;
  def: StatDef;
  rank: string;
  nextRank: string | null;
  fraction: number;
  toNext: number;
  sweep: SharedValue<number>;
}) {
  const hue = colors.stat[stat.key];
  const tail = nextRank ? `${toNext} to ${nextRank}` : 'Highest rank';
  return (
    <View className="flex-row items-center">
      <View
        accessible
        accessibilityLabel={`${stat.xp} of ${stat.maxXp} XP toward the next rank`}
        className="items-center justify-center"
        style={RING_STYLE}
      >
        <ProgressRing
          size={STAT_HERO.ring}
          strokeWidth={STAT_HERO.stroke}
          progress={fraction}
          color={hue}
          trackColor={withAlpha(hue, 0.18)}
          sweep={sweep}
        />
        <View className="items-center justify-center rounded-full bg-background-700/80" style={WELL_STYLE}>
          <StatIcon stat={stat.key} size={STAT_HERO.icon} color={hue} />
        </View>
      </View>
      <View className="flex-1" style={COLUMN_STYLE}>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={scale}
          className="font-display-italic text-xl text-white"
          style={NAME_STYLE}
        >
          {def.name}
        </Text>
        <Text maxFontSizeMultiplier={scale} className="mt-1" style={textShade}>
          <Text className="font-display text-sm tracking-md text-primary">RANK {stat.level}</Text>
          <Text className="font-display text-sm text-tertiary">{'  ·  '}</Text>
          <Text className="font-display-italic text-md tracking-xs text-white">{rank}</Text>
        </Text>
        <Text
          maxFontSizeMultiplier={scale}
          className="mt-1.5 font-body-medium text-sm text-secondary"
          style={textShade}
        >
          {stat.xp} / {stat.maxXp} XP · {tail}
        </Text>
      </View>
    </View>
  );
});
