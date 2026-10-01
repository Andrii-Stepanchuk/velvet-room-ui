import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import Lock from 'lucide-react-native/icons/lock';

import { colors } from '@/constants/theme';
import type { LayerStyle } from '@/lib/motion';
import { LOCKUP, MENU_LABEL_PAD } from '../../config/menuLayout';
import { useLockupGeometry } from '../../hooks/useLockupGeometry';
import { SlashLabel } from './SlashLabel';
import { Wedge } from './Wedge';

export const Lockup = memo(function Lockup({
  label,
  subtitle,
  sealed,
  groupStyle,
  subtitleStyle,
}: {
  label: string;
  subtitle: string;
  sealed: boolean;
  groupStyle: LayerStyle;
  subtitleStyle: LayerStyle;
}) {
  const { frame, onFrameLayout, onLabelLayout, geometry } = useLockupGeometry();

  return (
    <Animated.View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      onLayout={onFrameLayout}
      style={styles.frame}
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.group, groupStyle]}>
        {geometry && <Wedge geometry={geometry} />}
        <SlashLabel label={label} frame={frame} tip={geometry?.tip ?? null} onLabelLayout={onLabelLayout} />
      </Animated.View>
      <Animated.View style={[styles.subtitle, subtitleStyle]}>
        {sealed && <Lock size={13} color={colors.textSecondary} strokeWidth={2.4} />}
        <Text maxFontSizeMultiplier={1.15} className="ml-1.5 font-body-bold text-sm text-secondary">{subtitle}</Text>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  frame: { position: 'absolute', left: 0, top: 0, bottom: 0, right: MENU_LABEL_PAD },
  group: { transformOrigin: ['100%', LOCKUP.labelTop + LOCKUP.labelLine / 2, 0] },
  subtitle: {
    position: 'absolute',
    right: 2,
    top: LOCKUP.subtitleTop,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
