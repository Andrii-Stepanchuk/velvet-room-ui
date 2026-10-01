import { useWindowDimensions } from 'react-native';
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { slideIn, staggered } from '@/lib/motion';
import { ARCANA_CARD, ARCANA_SHEET } from '../config/arcanaSheet';

const { count, spread, slide, titleSlide } = ARCANA_SHEET.layers;
const { titleFadeDistance } = ARCANA_SHEET;

export type ArcanaSheetLayers = ReturnType<typeof useArcanaSheetStyles>['layers'];

export function useArcanaSheetStyles(progress: SharedValue<number>) {
  const { width, height: screenHeight } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const height = Math.round(screenHeight * ARCANA_SHEET.heightRatio);
  const rise = width * Math.tan((ARCANA_SHEET.topSlant * Math.PI) / 180);
  const travel = height + ARCANA_SHEET.lift;

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const backdrop = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheet = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * travel }],
  }));

  const layer = (value: number, index: number) => {
    'worklet';
    return reducedMotion ? 1 : staggered(value, index, count, spread);
  };

  const title = useAnimatedStyle(() => {
    const t = layer(progress.value, 0);
    const scrolled = Math.min(Math.max(scrollY.value / titleFadeDistance, 0), 1);
    return { ...slideIn(t, -titleSlide, 0), opacity: t * (1 - scrolled) };
  });
  const band = useAnimatedStyle(() => slideIn(layer(progress.value, 1), -slide, 0));
  const plate = useAnimatedStyle(() => slideIn(layer(progress.value, 2), -slide, 0));
  const card = useAnimatedStyle(() => {
    const t = layer(progress.value, 3);
    const rotate = ARCANA_CARD.enterRotate + (ARCANA_CARD.rotate - ARCANA_CARD.enterRotate) * t;
    return {
      opacity: t,
      transform: [{ translateY: (t - 1) * ARCANA_CARD.drop }, { rotate: `${rotate}deg` }],
    };
  });
  const body = useAnimatedStyle(() => ({ opacity: layer(progress.value, 4) }));
  const blessing = useAnimatedStyle(() => slideIn(layer(progress.value, 5), slide, 0));

  return {
    backdrop,
    sheet,
    onScroll,
    width,
    height,
    rise,
    layers: { title, band, plate, card, body, blessing },
  };
}
