import { useCallback, useState } from 'react';
import { useWindowDimensions, type LayoutChangeEvent } from 'react-native';

import { MOON_HEIGHT_RATIO, MOON_WIDTH_RATIO } from '../config/statusLayout';

export function useMoonSize() {
  const { width, height } = useWindowDimensions();
  const ideal = Math.round(Math.min(width * MOON_WIDTH_RATIO, height * MOON_HEIGHT_RATIO));
  const [stage, setStage] = useState<number | null>(null);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setStage(Math.floor(e.nativeEvent.layout.height));
  }, []);
  const size = stage === null ? ideal : Math.min(ideal, stage);
  return { ideal, size, onLayout };
}
