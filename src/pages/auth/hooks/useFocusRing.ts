import { useCallback } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const FOCUS_FADE = { duration: 160 };

export function useFocusRing() {
  const focus = useSharedValue(0);
  const ringStyle = useAnimatedStyle(() => ({ opacity: focus.value }));
  const onFocus = useCallback(() => {
    focus.value = withTiming(1, FOCUS_FADE);
  }, [focus]);
  const onBlur = useCallback(() => {
    focus.value = withTiming(0, FOCUS_FADE);
  }, [focus]);

  return { ringStyle, onFocus, onBlur };
}
