import { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ProgressRing, StatIcon } from '@/components/ui';
import { colors } from '@/constants/theme';
import { STAT_DEFS, rankName, xpFraction, type StatKey, type StatProgress } from '@/lib/game';
import { withAlpha } from '@/lib/style';
import { STAT_ORB } from '../../config/statusLayout';

const INNER = STAT_ORB.size - STAT_ORB.inset;

export const StatOrb = memo(function StatOrb({
  stat,
  onOpen,
}: {
  stat: StatProgress;
  onOpen: (stat: StatKey) => void;
}) {
  const hue = colors.stat[stat.key];
  const def = STAT_DEFS[stat.key];
  const press = useCallback(() => onOpen(stat.key), [onOpen, stat.key]);
  return (
    <Pressable
      onPress={press}
      className="items-center"
      accessibilityRole="button"
      accessibilityLabel={`${def.name}, level ${stat.level}, ${rankName(stat.key, stat.level)}, ${stat.xp} of ${stat.maxXp} XP`}
      accessibilityHint="Opens the rank path"
    >
      {({ pressed }) => (
        <>
          <View style={{ width: STAT_ORB.size, height: STAT_ORB.size }} className="items-center justify-center">
            <ProgressRing
              size={STAT_ORB.size}
              strokeWidth={STAT_ORB.ring}
              progress={xpFraction(stat)}
              color={hue}
              trackColor={withAlpha(hue, 0.18)}
            />
            <View
              style={{ width: INNER, height: INNER }}
              className={`items-center justify-center rounded-full ${pressed ? 'bg-background-400/90' : 'bg-background-700/80'}`}
            >
              <StatIcon stat={stat.key} size={STAT_ORB.icon} color={hue} />
            </View>
          </View>
          <Text maxFontSizeMultiplier={STAT_ORB.maxFontScale} className="mt-2 font-display text-md text-primary">
            {stat.level}
          </Text>
          <Text
            maxFontSizeMultiplier={STAT_ORB.maxFontScale}
            className="mt-0.5 font-display-medium text-2xs tracking-sm text-muted"
          >
            {def.abbr}
          </Text>
        </>
      )}
    </Pressable>
  );
});
