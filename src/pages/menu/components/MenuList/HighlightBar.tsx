import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { LayerStyle } from '@/lib/motion';
import { MENU_ENTRY_HEIGHT, MENU_SKEW_DEG } from '../../config/menuLayout';

export const HighlightBar = memo(function HighlightBar({ style }: { style: LayerStyle }) {
  return (
    <Animated.View pointerEvents="none" style={[styles.bar, style]}>
      <SkewPanel slant={MENU_SKEW_DEG} fill={colors.danger} style={styles.fill} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 6,
    right: -24,
    width: '80%',
    height: MENU_ENTRY_HEIGHT - 12,
  },
  fill: { flex: 1 },
});
