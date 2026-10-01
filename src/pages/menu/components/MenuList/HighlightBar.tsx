import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import type { LayerStyle } from '@/lib/motion';
import { HIGHLIGHT_BAR, MENU_SKEW_DEG } from '../../config/menuLayout';

const BLADE_FILL = withAlpha(colors.ink, 0.9);
const BLADE_STROKE = withAlpha(colors.accent, 0.3);
const SLANT_OFFSET = HIGHLIGHT_BAR.height * Math.tan((MENU_SKEW_DEG * Math.PI) / 180);

export const HighlightBar = memo(function HighlightBar({ style }: { style: LayerStyle }) {
  return (
    <Animated.View pointerEvents="none" style={[styles.bar, style]}>
      <SkewPanel slant={MENU_SKEW_DEG} fill={BLADE_FILL} stroke={BLADE_STROKE} style={styles.fill} />
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
  edge: { left: SLANT_OFFSET, height: HIGHLIGHT_BAR.edge },
});
