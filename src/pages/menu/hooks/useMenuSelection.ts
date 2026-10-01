import { useCallback, useState } from 'react';
import { Easing, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { MENU_ITEMS, type MenuItem } from '../config/menuItems';
import { HIGHLIGHT_MOVE_MS, MENU_ENTRY_HEIGHT, SEALED_SHAKE } from '../config/menuLayout';

const MOVE = { duration: HIGHLIGHT_MOVE_MS, easing: Easing.out(Easing.cubic) };

export function useMenuSelection(onConfirm: (item: MenuItem) => void) {
  const [selected, setSelected] = useState(0);
  const highlightY = useSharedValue(0);
  const shake = useSharedValue(0);

  const press = useCallback(
    (index: number) => {
      const item = MENU_ITEMS[index];
      setSelected(index);
      highlightY.value = withTiming(index * MENU_ENTRY_HEIGHT, MOVE, (finished) => {
        if (!finished) return;
        if (item.target) {
          scheduleOnRN(onConfirm, item);
          return;
        }
        const { distance, stepMs, repeats } = SEALED_SHAKE;
        shake.value = withSequence(
          withTiming(-distance, { duration: stepMs / 2 }),
          withRepeat(withTiming(distance, { duration: stepMs }), repeats, true),
          withTiming(0, { duration: stepMs / 2 }),
        );
      });
    },
    [highlightY, onConfirm, shake],
  );

  return { selected, highlightY, shake, press };
}
