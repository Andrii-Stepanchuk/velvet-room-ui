import { memo } from 'react';
import { Text, View } from 'react-native';
import Sparkle from 'lucide-react-native/icons/sparkle';

import { colors } from '@/constants/theme';
import type { XpAwardRow } from '@/lib/db/schema';
import { STAT_DEFS } from '@/lib/game';
import { formatClock, formatMultiplier } from '@/lib/format';
import { STAT_TEXT_CLASS } from '@/lib/statStyle';
import { textShade } from '@/lib/style';
import { DAY_LOG } from '../../config/dayLogLayout';
import { TimelineRail } from './TimelineRail';

export const ClearRow = memo(function ClearRow({ award, last }: { award: XpAwardRow; last: boolean }) {
  const stat = STAT_DEFS[award.stat].name;
  const time = formatClock(award.completedAt);
  const boosted = award.moonMult > 1;
  const blessed = award.blessingPct > 0;
  const label = [
    award.titleSnapshot,
    stat,
    `${award.awardedXp} XP`,
    boosted ? `${formatMultiplier(award.moonMult)} from the moon` : null,
    blessed ? 'blessed' : null,
    `cleared at ${time}`,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <View accessible accessibilityLabel={label} className="flex-row">
      <TimelineRail color={colors.stat[award.stat]} last={last} nodeTop={7} />
      <View className="flex-1">
        <Text numberOfLines={2} maxFontSizeMultiplier={DAY_LOG.maxFontScale} className="font-body-medium text-md text-primary" style={textShade}>
          {award.titleSnapshot}
        </Text>
        <View className="mt-1 flex-row flex-wrap items-center gap-y-1">
          <Text maxFontSizeMultiplier={DAY_LOG.maxFontScale} className={`font-display-medium text-2xs tracking-md ${STAT_TEXT_CLASS[award.stat]}`}>
            {stat.toUpperCase()}
          </Text>
          <Text maxFontSizeMultiplier={DAY_LOG.maxFontScale} className={`ml-2.5 font-display text-sm tracking-xs ${STAT_TEXT_CLASS[award.stat]}`}>
            +{award.awardedXp} XP
          </Text>
          {boosted && (
            <Text maxFontSizeMultiplier={DAY_LOG.maxFontScale} className="ml-1.5 font-display-medium text-2xs text-accent">
              {formatMultiplier(award.moonMult)}
            </Text>
          )}
          {blessed && (
            <View className="ml-1.5">
              <Sparkle size={12} color={colors.accent} strokeWidth={2.2} />
            </View>
          )}
          <Text
            maxFontSizeMultiplier={DAY_LOG.maxFontScale}
            className="ml-auto pl-3 font-display-medium text-2xs tracking-sm text-tertiary"
            style={textShade}
          >
            {time}
          </Text>
        </View>
      </View>
    </View>
  );
});
