import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { CONTINUE_PROMPT } from '../config/ceremony';
import { useVisibilityFade } from './useVisibilityFade';

export function useContinuePrompt(visible: boolean) {
  const reducedMotion = useReducedMotion();
  const breathe = useSharedValue(1);
  const fade = useVisibilityFade(visible);

  useEffect(() => {
    if (!visible || reducedMotion) {
      cancelAnimation(breathe);
      breathe.value = 1;
      return;
    }
    breathe.value = withRepeat(
      withTiming(CONTINUE_PROMPT.dim, { duration: CONTINUE_PROMPT.breatheMs, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [breathe, reducedMotion, visible]);

  const label = useAnimatedStyle(() => ({ opacity: breathe.value }));
  return { fade, label };
}
