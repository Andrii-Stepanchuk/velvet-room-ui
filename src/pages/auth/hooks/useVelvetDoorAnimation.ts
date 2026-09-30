import { useEffect } from 'react';
import { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import type { EntranceAnim } from './useEntranceSequence';

const FRAME_PULSE_MS = 2250;
const HALF_OPEN_ANGLE_DEG = 108;

export function useVelvetDoorAnimation(anim: EntranceAnim) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: FRAME_PULSE_MS, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [pulse]);

  const container = useAnimatedStyle(() => ({
    opacity: anim.doorOpacity.value,
    transform: [{ scale: anim.cameraScale.value }],
  }));
  const glow = useAnimatedStyle(() => ({ opacity: anim.glowOpacity.value }));
  const floor = useAnimatedStyle(() => ({ opacity: anim.doorOpacity.value }));
  const leftHalf = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${-HALF_OPEN_ANGLE_DEG * anim.doorProgress.value}deg` }],
  }));
  const rightHalf = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${HALF_OPEN_ANGLE_DEG * anim.doorProgress.value}deg` }],
  }));
  const seam = useAnimatedStyle(() => ({ opacity: Math.max(0, 1 - anim.doorProgress.value * 3) }));
  const frame = useAnimatedStyle(() => ({ opacity: 0.7 + pulse.value * 0.3 }));

  return { container, glow, floor, leftHalf, rightHalf, seam, frame };
}
