import { memo } from 'react';
import { Text, View } from 'react-native';
import Sparkle from 'lucide-react-native/icons/sparkle';

import { colors } from '@/constants/theme';
import type { StatKey } from '@/lib/game';
import { formatMultiplier } from '@/lib/format';
import { STAT_TEXT_CLASS } from '@/lib/statStyle';
import { QUEST_ROW } from '../../config/tasksLayout';

export const XpValue = memo(function XpValue({
  stat,
  xp,
  moonMult,
  blessed,
}: {
  stat: StatKey;
  xp: number;
  moonMult: number;
  blessed: boolean;
}) {
  return (
    <View className="ml-3 flex-row items-center">
      <Text maxFontSizeMultiplier={QUEST_ROW.maxFontScale} className={`font-display text-sm tracking-xs ${STAT_TEXT_CLASS[stat]}`}>
        +{xp} XP
      </Text>
      {moonMult > 1 && (
        <Text maxFontSizeMultiplier={QUEST_ROW.maxFontScale} className="ml-1.5 font-display-medium text-2xs text-accent">
          {formatMultiplier(moonMult)}
        </Text>
      )}
      {blessed && (
        <View className="ml-1.5">
          <Sparkle size={12} color={colors.accent} strokeWidth={2.2} />
        </View>
      )}
    </View>
  );
});
