import { useAnimatedStyle } from 'react-native-reanimated';

import type { EntranceAnim } from './useEntranceSequence';
import { useOpacityStyle } from './useOpacityStyle';

export function useEntranceLayerStyles(anim: EntranceAnim) {
  const form = useAnimatedStyle(() => ({
    opacity: anim.formOpacity.value,
    transform: [{ translateY: anim.formTranslate.value }],
  }));
  const bubbles = useOpacityStyle(anim.formOpacity);
  const videoLayer = useOpacityStyle(anim.videoOpacity);
  const welcome = useOpacityStyle(anim.welcomeOpacity);

  return { form, bubbles, videoLayer, welcome };
}
