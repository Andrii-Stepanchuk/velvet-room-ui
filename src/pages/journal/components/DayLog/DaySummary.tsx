import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CONFIG } from '@/constants/config';
import { colors } from '@/constants/theme';
import type { DaySummary as Summary, MoonPhaseName } from '@/lib/game';
import { formatMultiplier } from '@/lib/format';
import { textShade } from '@/lib/style';
import { DAY_LOG } from '../../config/dayLogLayout';
import { SkyChip } from './SkyChip';

export const DaySummary = memo(function DaySummary({
  summary,
  phase,
  fullMoon,
}: {
  summary: Summary;
  phase: MoonPhaseName;
  fullMoon: boolean;
}) {
  const counted = summary.cleared > 0;
  const cleared = summary.scheduled !== null ? `${summary.cleared}/${summary.scheduled}` : `${summary.cleared}`;
  return (
    <View
      accessible
      accessibilityLabel={`${counted ? `${summary.xp} XP earned, ${cleared.replace('/', ' of ')} cleared. ` : ''}${fullMoon ? 'Full Moon, double XP' : phase}`}
      className="flex-row flex-wrap items-center gap-y-1"
    >
      {counted && (
        <Text maxFontSizeMultiplier={DAY_LOG.maxFontScale} className="mr-4 font-display text-sm tracking-sm text-primary" style={textShade}>
          +{summary.xp} XP · {cleared} CLEARED
        </Text>
      )}
      {fullMoon ? (
        <SkyChip label={`FULL MOON · ${formatMultiplier(CONFIG.boosts.fullMoonMultiplier)} XP`} />
      ) : (
        <View className="flex-row items-center">
          <View style={css.diamond} />
          <Text maxFontSizeMultiplier={DAY_LOG.maxFontScale} className="ml-2 font-display-medium text-xs tracking-sm text-secondary" style={textShade}>
            {phase.toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
});

const css = StyleSheet.create({
  diamond: { width: 6, height: 6, backgroundColor: colors.textTertiary, transform: [{ rotate: '45deg' }] },
});
