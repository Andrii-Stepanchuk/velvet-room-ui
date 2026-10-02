import { useCallback, useRef, useState } from 'react';
import {
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { MENU_ITEMS, type MenuItem } from '../config/menuItems';
import { MENU_ENTRY, SEALED_SHAKE, SELECT_TIMING } from '../config/menuLayout';

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
  const selectedRef = useRef(0);
  const movingRef = useRef(false);
  const highlightY = useSharedValue(0);
  const shake = useSharedValue(0);

  const settle = useCallback(
    (index: number) => {
      movingRef.current = false;
      const item = MENU_ITEMS[index];
      if (item.target) onConfirm(item);
      else if (!reducedMotion) shakeHighlight(shake);
    },
    [onConfirm, reducedMotion, shake],
  );

  const release = useCallback(() => {
    movingRef.current = false;
  }, []);

  const press = useCallback(
    (index: number) => {
      if (movingRef.current) return;
      if (index === selectedRef.current) {
        settle(index);
        return;
      }
      selectedRef.current = index;
      movingRef.current = true;
      setSelected(index);
      highlightY.value = withTiming(
        index * MENU_ENTRY.height,
        { duration: reducedMotion ? SELECT_TIMING.reducedMs : SELECT_TIMING.ms, easing: SELECT_TIMING.easing },
        (finished) => {
          if (finished) scheduleOnRN(settle, index);
          else scheduleOnRN(release);
        },
      );
    },
    [highlightY, reducedMotion, release, settle],
  );

  return { selected, highlightY, shake, press };
}
