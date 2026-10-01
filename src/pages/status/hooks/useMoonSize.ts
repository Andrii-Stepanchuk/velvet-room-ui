import { useWindowDimensions } from 'react-native';

import { MOON_HEIGHT_RATIO, MOON_WIDTH_RATIO } from '../config/statusLayout';

export function useMoonSize(): number {
  const { width, height } = useWindowDimensions();
  return Math.round(Math.min(width * MOON_WIDTH_RATIO, height * MOON_HEIGHT_RATIO));
}
