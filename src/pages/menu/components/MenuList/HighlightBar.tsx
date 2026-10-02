import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { LayerStyle } from '@/lib/motion';
import { slantOffset, withAlpha } from '@/lib/style';
import { HIGHLIGHT_BAR } from '../../config/menuLayout';

const FILL = withAlpha(colors.ink, 0.9);
const STROKE = withAlpha(colors.accent, 0.3);

export const HighlightBar = memo(function HighlightBar({ style }: { style: LayerStyle }) {
  return (
    <Animated.View pointerEvents="none" style={[styles.bar, style]}>
      <SkewPanel slant={HIGHLIGHT_BAR.slant} fill={FILL} stroke={STROKE} style={styles.fill} />
      <View className="absolute right-0 top-0 bg-accent/80" style={styles.edge} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: HIGHLIGHT_BAR.top,
    right: -HIGHLIGHT_BAR.bleed,
    width: HIGHLIGHT_BAR.width,
    height: HIGHLIGHT_BAR.height,
  },
  fill: { flex: 1 },
  edge: { left: slantOffset(HIGHLIGHT_BAR.height, HIGHLIGHT_BAR.slant), height: HIGHLIGHT_BAR.edge },
});
