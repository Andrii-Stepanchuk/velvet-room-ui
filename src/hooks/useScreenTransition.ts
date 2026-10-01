import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useReducedMotion, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ENTER_EASING, EXIT_EASING, SCREEN_TIMING } from '@/constants/motion';

export interface ScreenTransition {
  progress: SharedValue<number>;
  leaving: boolean;
  leave: (navigate: () => void) => void;
}

export function useScreenTransition(): ScreenTransition {
  const navigation = useNavigation();
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const allowRemoveRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      leavingRef.current = false;
      allowRemoveRef.current = false;
      setLeaving(false);
      progress.value = withTiming(1, {
        duration: reducedMotion ? SCREEN_TIMING.reduced : SCREEN_TIMING.enter,
        easing: ENTER_EASING,
      });
    }, [progress, reducedMotion]),
  );

  const leave = useCallback(
    (navigate: () => void) => {
      if (leavingRef.current) return;
      leavingRef.current = true;
      setLeaving(true);
      const complete = () => {
        allowRemoveRef.current = true;
        navigate();
      };
      progress.value = withTiming(
        0,
        { duration: reducedMotion ? SCREEN_TIMING.reduced : SCREEN_TIMING.exit, easing: EXIT_EASING },
        (finished) => {
          if (finished) scheduleOnRN(complete);
        },
      );
    },
    [progress, reducedMotion],
  );

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (allowRemoveRef.current || !navigation.isFocused()) return;
        e.preventDefault();
        leave(() => navigation.dispatch(e.data.action));
      }),
    [navigation, leave],
  );

  return { progress, leaving, leave };
}
