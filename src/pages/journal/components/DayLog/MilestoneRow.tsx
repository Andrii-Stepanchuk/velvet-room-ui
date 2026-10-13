import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { STAT_DEFS, rankName, type Milestone } from '@/lib/game';
import { slantOffset, withAlpha } from '@/lib/style';
import { MILESTONE } from '../../config/dayLogLayout';
import { TimelineRail } from './TimelineRail';

const DIVIDER = withAlpha(colors.ink, 0.3);
const PAD = slantOffset(MILESTONE.height, MILESTONE.slant) + 12;
const UNDERLINE_INSET = slantOffset(MILESTONE.underline, MILESTONE.slant);

function copy(milestone: Milestone) {
  if (milestone.kind === 'rank') {
    const stat = STAT_DEFS[milestone.stat].name;
    const rank = rankName(milestone.stat, milestone.level);
    return {
      kicker: `RANK UP · ${milestone.level}`,
      title: `${stat.toUpperCase()} · ${rank.toUpperCase()}`,
      line: colors.stat[milestone.stat],
      label: `Rank up. ${stat} reached rank ${milestone.level}, ${rank}`,
    };
  }
  return {
    kicker: 'LEVEL UP',
    title: `OVERALL LV ${milestone.level}`,
    line: colors.accent,
    label: `Level up. Overall Level ${milestone.level}`,
  };
}

export const MilestoneRow = memo(function MilestoneRow({ milestone, last }: { milestone: Milestone; last: boolean }) {
  const { kicker, title, line, label } = copy(milestone);
  return (
    <View accessible accessibilityLabel={label} className="flex-row">
      <TimelineRail color={colors.textPrimary} last={last} nodeTop={(MILESTONE.height - 8) / 2} />
      <SkewPanel
        slant={MILESTONE.slant}
        fill={colors.textPrimary}
        shadow={colors.background[700]}
        className="shrink flex-row items-center self-start"
        style={{ height: MILESTONE.height, paddingLeft: PAD, paddingRight: PAD }}
      >
        <Text maxFontSizeMultiplier={MILESTONE.maxFontScale} className="font-display text-2xs tracking-lg text-ink">
          {kicker}
        </Text>
        <View style={css.divider} />
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={MILESTONE.maxFontScale}
          className="shrink font-display-italic text-sm tracking-xs text-ink"
        >
          {title}
        </Text>
        <View style={[css.underline, { backgroundColor: line, left: UNDERLINE_INSET }]} />
      </SkewPanel>
    </View>
  );
});

const css = StyleSheet.create({
  divider: { width: 1, height: MILESTONE.height * 0.5, marginHorizontal: 10, backgroundColor: DIVIDER },
  underline: { position: 'absolute', bottom: 0, right: slantOffset(MILESTONE.height, MILESTONE.slant), height: MILESTONE.underline },
});
