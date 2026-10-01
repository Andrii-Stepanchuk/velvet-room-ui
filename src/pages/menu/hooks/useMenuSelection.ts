import { useCallback, useState } from 'react';
import {
  Easing,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { MENU_ITEMS, type MenuItem } from '../config/menuItems';
import { HIGHLIGHT_MOVE_MS, MENU_ENTRY_HEIGHT, SEALED_SHAKE, SELECT_REDUCED_MS } from '../config/menuLayout';

function shakeHighlight(shake: SharedValue<number>) {
  'worklet';
  const { distance, stepMs, repeats } = SEALED_SHAKE;
  shake.value = withSequence(
    withTiming(-distance, { duration: stepMs / 2 }),
    withRepeat(withTiming(distance, { duration: stepMs }), repeats, true),
    withTiming(0, { duration: stepMs / 2 }),
  );
}

export function useMenuSelection(onConfirm: (item: MenuItem) => void) {
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const highlightY = useSharedValue(0);
  const shake = useSharedValue(0);

  const press = useCallback(
    (index: number) => {
      const item = MENU_ITEMS[index];
      if (index === selected) {
        if (item.target) onConfirm(item);
        else shakeHighlight(shake);
        return;
      }
      setSelected(index);
      highlightY.value = withTiming(
        index * MENU_ENTRY_HEIGHT,
        { duration: reducedMotion ? SELECT_REDUCED_MS : HIGHLIGHT_MOVE_MS, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (!finished) return;
          if (item.target) scheduleOnRN(onConfirm, item);
          else shakeHighlight(shake);
        },
      );
    },
    [highlightY, onConfirm, reducedMotion, selected, shake],
  );

  return { selected, highlightY, shake, press };
}
