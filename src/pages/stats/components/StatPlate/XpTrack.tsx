import { memo } from 'react';
import { View } from 'react-native';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { XP_TRACK } from '../../config/statsLayout';

export const XpTrack = memo(function XpTrack({
  hue,
  fraction,
  selected,
}: {
  hue: string;
  fraction: number;
  selected: boolean;
}) {
  return (
    <View
      className="flex-1 overflow-hidden rounded-xs"
      style={{
        height: XP_TRACK.height,
        backgroundColor: selected ? withAlpha(colors.ink, 0.85) : withAlpha(hue, 0.18),
      }}
    >
      <View
        style={{
          width: `${fraction * 100}%`,
          height: '100%',
          backgroundColor: hue,
        }}
      />
    </View>
  );
});
