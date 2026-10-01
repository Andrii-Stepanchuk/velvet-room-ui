import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ARCANA_SHEET } from '../config/arcanaSheet';

export function useArcanaSheet() {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const show = useCallback(() => {
    setOpen(true);
    progress.value = withTiming(1, {
      duration: reducedMotion ? ARCANA_SHEET.reducedMs : ARCANA_SHEET.inMs,
      easing: ARCANA_SHEET.easingIn,
    });
  }, [progress, reducedMotion]);

  const hide = useCallback(() => {
    progress.value = withTiming(
      0,
      {
        duration: reducedMotion ? ARCANA_SHEET.reducedMs : ARCANA_SHEET.outMs,
        easing: ARCANA_SHEET.easingOut,
      },
      (finished) => {
        if (finished) scheduleOnRN(setOpen, false);
      },
    );
  }, [progress, reducedMotion]);

  useFocusEffect(
    useCallback(() => {
      if (!open) return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        hide();
        return true;
      });
      return () => sub.remove();
    }, [open, hide]),
  );

  return { open, progress, show, hide };
}
