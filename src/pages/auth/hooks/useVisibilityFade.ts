import { useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { useOpacityStyle } from './useOpacityStyle';

const FADE_IN_MS = 400;
const FADE_OUT_MS = 200;

export function useVisibilityFade(visible: boolean) {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: visible ? FADE_IN_MS : FADE_OUT_MS });
  }, [opacity, visible]);
  return useOpacityStyle(opacity);
}
