import { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { PAGE_HEADER_MOTION } from '@/constants/motion';
import { slideIn } from '@/lib/motion';

const { tabSlide, titleSlide, tabs, title: titleRange, caption: captionRange } = PAGE_HEADER_MOTION;

export function usePageHeaderLayers(progress: SharedValue<number>) {
  const dateTab = useAnimatedStyle(() =>
    slideIn(interpolate(progress.value, tabs, [0, 1], Extrapolation.CLAMP), -tabSlide, 0),
  );
  const back = useAnimatedStyle(() =>
    slideIn(interpolate(progress.value, tabs, [0, 1], Extrapolation.CLAMP), tabSlide, 0),
  );
  const title = useAnimatedStyle(() =>
    slideIn(interpolate(progress.value, titleRange, [0, 1], Extrapolation.CLAMP), titleSlide, 0),
  );
  const caption = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, captionRange, [0, 1], Extrapolation.CLAMP),
  }));
  return { dateTab, back, title, caption };
}
