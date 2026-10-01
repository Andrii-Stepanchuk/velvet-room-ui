import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';

import { SEALED_SUBTITLE, type MenuItem } from '../../config/menuItems';
import { MENU_ENTRY_HEIGHT } from '../../config/menuLayout';
import { useMenuEntryStyle } from '../../hooks/useMenuEntryStyle';

export const MenuEntry = memo(function MenuEntry({
  item,
  index,
  selected,
  progress,
  onPress,
}: {
  item: MenuItem;
  index: number;
  selected: boolean;
  progress: SharedValue<number>;
  onPress: (index: number) => void;
}) {
  const style = useMenuEntryStyle(progress, index);
  const sealed = item.target === null;
  const labelColor = selected ? 'text-white' : sealed ? 'text-disabled' : 'text-tertiary';

  return (
    <Animated.View style={[styles.row, style]}>
      <Pressable
        onPress={() => onPress(index)}
        accessibilityRole="button"
        accessibilityLabel={sealed ? `${item.label}, sealed` : item.label}
        accessibilityState={{ selected }}
        className="items-end pr-10"
      >
        <Text className={`font-display-italic text-2xl ${labelColor}`}>{item.label}</Text>
        {selected && (
          <Text className="-mt-1 font-body-medium text-xs text-white">{sealed ? SEALED_SUBTITLE : item.subtitle}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  row: { height: MENU_ENTRY_HEIGHT, justifyContent: 'center' },
});
