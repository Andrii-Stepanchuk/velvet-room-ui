import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { PAGE_PADDING_X } from '@/constants/layout';
import { colors } from '@/constants/theme';
import { slantOffset, withAlpha } from '@/lib/style';
import { RANK_ROW } from '../../config/statDetailLayout';

const { blade } = RANK_ROW;
const FILL = withAlpha(colors.ink, 0.9);
const STROKE = withAlpha(colors.accent, 0.3);
const HEIGHT = RANK_ROW.height - blade.inset * 2;

export const CurrentBlade = memo(function CurrentBlade() {
  return (
    <View pointerEvents="none" style={styles.blade}>
      <SkewPanel slant={blade.slant} fill={FILL} stroke={STROKE} style={styles.fill} />
      <View className="absolute right-0 top-0 bg-accent/80" style={styles.edge} />
    </View>
  );
});

const styles = StyleSheet.create({
  blade: {
    position: 'absolute',
    top: blade.inset,
    height: HEIGHT,
    left: -blade.lead,
    right: -(PAGE_PADDING_X + blade.bleed),
  },
  fill: { flex: 1 },
  edge: { left: slantOffset(HEIGHT, blade.slant), height: blade.edge },
});
