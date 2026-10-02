import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { ramp } from '@/lib/motion';
import { DOOR_HALO } from '../config/doorHalo';
import type { EntranceAnim } from './useEntranceSequence';

const HALF_OPEN_ANGLE_DEG = 108;
const { pulseMs, rest, peak, frameRest, openSwell, zoomFade } = DOOR_HALO;

export function useVelvetDoorAnimation(anim: EntranceAnim) {
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(reducedMotion ? 1 : 0);
  useEffect(() => {
    if (reducedMotion) {
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(withTiming(1, { duration: pulseMs, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [pulse, reducedMotion]);

  const container = useAnimatedStyle(() => ({
    opacity: anim.doorOpacity.value,
    transform: [{ scale: anim.cameraScale.value }],
  }));
  const glow = useAnimatedStyle(() => ({ opacity: anim.glowOpacity.value }));
  const halo = useAnimatedStyle(() => ({
    opacity:
      Math.max(rest + pulse.value * (peak - rest), anim.glowOpacity.value) *
      (1 - ramp(anim.cameraScale.value, zoomFade[0], zoomFade[1])),
    transform: [{ scale: 1 + anim.glowOpacity.value * openSwell }],
  }));
  const leftHalf = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${-HALF_OPEN_ANGLE_DEG * anim.doorProgress.value}deg` }],
  }));
  const rightHalf = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${HALF_OPEN_ANGLE_DEG * anim.doorProgress.value}deg` }],
  }));
  const seam = useAnimatedStyle(() => ({ opacity: Math.max(0, 1 - anim.doorProgress.value * 3) }));
  const frame = useAnimatedStyle(() => ({ opacity: frameRest + pulse.value * (1 - frameRest) }));

  return { container, glow, halo, leftHalf, rightHalf, seam, frame };
}
