import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useReducedMotion, useSharedValue, withTiming, type EasingFunction } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export interface SheetTiming {
  inMs: number;
  outMs: number;
  reducedMs: number;
  easingIn: EasingFunction;
  easingOut: EasingFunction;
}

export function useSheet(timing: SheetTiming, onHidden?: () => void) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const close = useCallback(() => {
    setOpen(false);
    onHidden?.();
  }, [onHidden]);

  const show = useCallback(() => {
    setOpen(true);
    progress.value = withTiming(1, {
      duration: reducedMotion ? timing.reducedMs : timing.inMs,
      easing: timing.easingIn,
    });
  }, [progress, reducedMotion, timing]);

  const hide = useCallback(() => {
    progress.value = withTiming(
      0,
      {
        duration: reducedMotion ? timing.reducedMs : timing.outMs,
        easing: timing.easingOut,
      },
      (finished) => {
        if (finished) scheduleOnRN(close);
      },
    );
  }, [progress, reducedMotion, timing, close]);

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
