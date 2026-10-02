import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import Lock from 'lucide-react-native/icons/lock';

import { colors } from '@/constants/theme';
import type { LayerStyle } from '@/lib/motion';
import { LOCKUP, MENU_ENTRY } from '../../../config/menuLayout';

export const Lockup = memo(function Lockup({
  label,
  subtitle,
  sealed,
  labelStyle,
  subtitleStyle,
}: {
  label: string;
  subtitle: string;
  sealed: boolean;
  labelStyle: LayerStyle;
  subtitleStyle: LayerStyle;
}) {
  return (
    <Animated.View pointerEvents="none" importantForAccessibility="no-hide-descendants" style={styles.frame}>
      <Animated.View style={[styles.label, labelStyle]}>
        <Text maxFontSizeMultiplier={1} className="font-display-italic text-2xl text-white" style={styles.text}>
          {label}
        </Text>
      </Animated.View>
      <Animated.View style={[styles.subtitle, subtitleStyle]}>
        {sealed && <Lock size={13} color={colors.textSecondary} strokeWidth={2.4} />}
        <Text maxFontSizeMultiplier={1.15} className="ml-1.5 font-body-bold text-sm text-secondary">
          {subtitle}
        </Text>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  frame: { position: 'absolute', left: 0, top: 0, bottom: 0, right: MENU_ENTRY.labelPad },
  label: { position: 'absolute', right: 0, top: LOCKUP.labelTop, transformOrigin: 'right center' },
  text: { lineHeight: LOCKUP.labelLine, paddingHorizontal: 2 },
  subtitle: {
    position: 'absolute',
    right: 2,
    top: LOCKUP.subtitleTop,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
