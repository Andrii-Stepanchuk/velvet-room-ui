import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import Lock from 'lucide-react-native/icons/lock';

import { colors } from '@/constants/theme';
import { textGlow } from '@/lib/style';
import { SEALED_SUBTITLE, type MenuItem } from '../../config/menuItems';
import { LOCKUP, MENU_ENTRY_HEIGHT, MENU_LABEL_PAD, SEALED_OPACITY } from '../../config/menuLayout';
import { useEntryActive } from '../../hooks/useEntryActive';
import { useMenuEntryStyle } from '../../hooks/useMenuEntryStyle';
import { Lockup } from './Lockup';

export const MenuEntry = memo(function MenuEntry({
  item,
  index,
  selected,
  progress,
  shake,
  onPress,
}: {
  item: MenuItem;
  index: number;
  selected: boolean;
  progress: SharedValue<number>;
  shake: SharedValue<number>;
  onPress: (index: number) => void;
}) {
  const style = useMenuEntryStyle(progress, index);
  const active = useEntryActive(progress, selected, shake);
  const sealed = item.target === null;

  return (
    <Animated.View style={[styles.row, style]}>
      <Pressable
        onPress={() => onPress(index)}
        accessibilityRole="button"
        accessibilityLabel={sealed ? `${item.label}, sealed` : item.label}
        accessibilityHint={sealed ? SEALED_SUBTITLE : item.subtitle}
        accessibilityState={{ selected }}
        style={styles.press}
      >
        <Lockup
          label={item.label}
          subtitle={sealed ? SEALED_SUBTITLE : item.subtitle}
          sealed={sealed}
          groupStyle={active.group}
          subtitleStyle={active.subtitle}
        />
        <Animated.View importantForAccessibility="no-hide-descendants" style={[styles.idle, active.idle]}>
          <View className="flex-row items-center" style={sealed ? styles.sealed : undefined}>
            {sealed && <Lock size={18} color={colors.textDisabled} strokeWidth={2.2} />}
            <Text
              maxFontSizeMultiplier={1}
              className={`ml-2 font-display-italic text-2xl ${sealed ? 'text-disabled' : 'text-accent'}`}
              style={sealed ? styles.label : [styles.label, textGlow]}
            >
              {item.label}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  row: { height: MENU_ENTRY_HEIGHT },
  press: { flex: 1 },
  idle: {
    position: 'absolute',
    top: LOCKUP.labelTop,
    right: MENU_LABEL_PAD,
    transformOrigin: 'right center',
  },
  sealed: { opacity: SEALED_OPACITY },
  label: { lineHeight: LOCKUP.labelLine, paddingHorizontal: 2 },
});
