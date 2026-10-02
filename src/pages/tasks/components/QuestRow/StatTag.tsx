import { memo } from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { STAT_DEFS, type StatKey } from '@/lib/game';
import { pixelAlignedBorderWidth, withAlpha } from '@/lib/style';
import { STAT_TEXT_CLASS } from '@/lib/statStyle';
import { QUEST_ROW } from '../../config/tasksLayout';

export const StatTag = memo(function StatTag({ stat }: { stat: StatKey }) {
  return (
    <View
      className="px-2 py-0.5"
      style={{ borderWidth: pixelAlignedBorderWidth, borderColor: withAlpha(colors.stat[stat], 0.6) }}
    >
      <Text
        maxFontSizeMultiplier={QUEST_ROW.maxFontScale}
        className={`font-display-medium text-2xs tracking-md ${STAT_TEXT_CLASS[stat]}`}
      >
        {STAT_DEFS[stat].name.toUpperCase()}
      </Text>
    </View>
  );
});
