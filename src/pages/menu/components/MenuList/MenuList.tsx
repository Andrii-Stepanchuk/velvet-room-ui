import { memo } from 'react';
import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { MENU_ITEMS } from '../../config/menuItems';
import { MENU_ENTRY } from '../../config/menuLayout';
import { useHighlightStyle } from '../../hooks/useHighlightStyle';
import { HighlightBar } from './HighlightBar';
import { MenuEntry } from './MenuEntry/MenuEntry';

export const MenuList = memo(function MenuList({
  progress,
  selected,
  highlightY,
  shake,
  onPress,
}: {
  progress: SharedValue<number>;
  selected: number;
  highlightY: SharedValue<number>;
  shake: SharedValue<number>;
  onPress: (index: number) => void;
}) {
  const highlightStyle = useHighlightStyle(progress, highlightY, shake);

  return (
    <View style={{ height: MENU_ITEMS.length * MENU_ENTRY.height }}>
      <HighlightBar style={highlightStyle} />
      {MENU_ITEMS.map((item, index) => (
        <MenuEntry
          key={item.key}
          item={item}
          index={index}
          selected={index === selected}
          progress={progress}
          shake={shake}
          onPress={onPress}
        />
      ))}
    </View>
  );
});
