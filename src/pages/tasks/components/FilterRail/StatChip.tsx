import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { SkewPanel, StatIcon } from '@/components/ui';
import { colors } from '@/constants/theme';
import { STAT_DEFS, type StatKey } from '@/lib/game';
import { slantOffset, withAlpha } from '@/lib/style';
import { STAT_TEXT_CLASS } from '@/lib/statStyle';
import { STAT_CHIP } from '../../config/tasksLayout';

const FILL = withAlpha(colors.background[700], 0.85);
const FILL_PRESSED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.2);
const PAD = slantOffset(STAT_CHIP.height, STAT_CHIP.slant) + 2;
const HIT_SLOP = { top: 5, bottom: 5 };

export const StatChip = memo(function StatChip({
  stat,
  active,
  onPress,
}: {
  stat: StatKey;
  active: boolean;
  onPress: (stat: StatKey) => void;
}) {
  const hue = colors.stat[stat];
  return (
    <Pressable
      onPress={() => onPress(stat)}
      hitSlop={HIT_SLOP}
      className="flex-1"
      accessibilityRole="checkbox"
      accessibilityLabel={`${STAT_DEFS[stat].name} quests`}
      accessibilityState={{ checked: active }}
    >
      {({ pressed }) => (
        <SkewPanel
          slant={STAT_CHIP.slant}
          fill={pressed && !active ? FILL_PRESSED : FILL}
          tint={active ? withAlpha(hue, 0.18) : undefined}
          stroke={active ? withAlpha(hue, 0.9) : STROKE}
          className="flex-row items-center justify-center"
          style={{ height: STAT_CHIP.height, paddingLeft: PAD, paddingRight: PAD }}
        >
          <StatIcon stat={stat} size={STAT_CHIP.icon} color={active ? hue : withAlpha(hue, 0.75)} />
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={STAT_CHIP.maxFontScale}
            className={`ml-1 shrink font-display text-2xs tracking-xs ${active ? STAT_TEXT_CLASS[stat] : 'text-secondary'}`}
          >
            {STAT_DEFS[stat].abbr}
          </Text>
        </SkewPanel>
      )}
    </Pressable>
  );
});
