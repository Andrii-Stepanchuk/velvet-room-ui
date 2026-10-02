import { useAnimatedStyle } from 'react-native-reanimated';

import { ramp } from '@/lib/motion';
import { CONTRACT_PLATE, DEAL, SEAL, SIGNATURE } from '../config/ceremony';
import type { EntranceAnim } from './useEntranceSequence';

const PLATE_DROP = (DEAL.blockHeight + DEAL.gap) / 2;

export function useCeremonyStyles(anim: EntranceAnim) {
  const plate = useAnimatedStyle(() => {
    const lift = anim.contractLift.value;
    const shown = anim.contractIn.value * (1 - lift * (1 - CONTRACT_PLATE.dimTo)) * (1 - anim.ceremonyExit.value);
    return {
      opacity: shown,
      transform: [{ translateY: (1 - lift) * PLATE_DROP + (1 - anim.contractIn.value) * CONTRACT_PLATE.enterRise }],
    };
  });

  const card = useAnimatedStyle(() => {
    const t = anim.cardProgress.value;
    return {
      opacity: ramp(t, 0, 0.3) * (1 - anim.ceremonyExit.value),
      transform: [
        { perspective: DEAL.perspective },
        { translateY: (t - 1) * DEAL.drop },
        { rotateY: `${(1 - t) * DEAL.edgeOn}deg` },
        { rotate: `${DEAL.tiltFrom + (DEAL.tiltTo - DEAL.tiltFrom) * t}deg` },
      ],
    };
  });

  const cardCaption = useAnimatedStyle(() => {
    const t = ramp(anim.cardProgress.value, 0.55, 1);
    return { opacity: t * (1 - anim.ceremonyExit.value), transform: [{ translateY: (1 - t) * 8 }] };
  });

  const line = useAnimatedStyle(() => ({ transform: [{ scaleX: anim.writeProgress.value }] }));

  const seal = useAnimatedStyle(() => {
    const t = anim.sealProgress.value;
    return {
      opacity: ramp(t, 0, 0.35),
      transform: [{ scale: SEAL.stampFrom + (1 - SEAL.stampFrom) * t }, { rotate: '45deg' }],
    };
  });

  const sealRipple = useAnimatedStyle(() => {
    const t = ramp(anim.sealProgress.value, 0.25, 1);
    return {
      opacity: t > 0 ? (1 - t) * 0.8 : 0,
      transform: [{ scale: 1 + (SEAL.rippleTo - 1) * t }, { rotate: '45deg' }],
    };
  });

  const sealLabel = useAnimatedStyle(() => ({ opacity: ramp(anim.sealProgress.value, 0.5, 1) }));

  return { plate, card, cardCaption, line, seal, sealRipple, sealLabel };
}

export function useSignatureWipe(anim: EntranceAnim, width: number) {
  const clip = useAnimatedStyle(() => ({ transform: [{ translateX: -(1 - anim.writeProgress.value) * width }] }));
  const content = useAnimatedStyle(() => ({ transform: [{ translateX: (1 - anim.writeProgress.value) * width }] }));
  const nib = useAnimatedStyle(() => {
    const p = anim.writeProgress.value;
    return {
      opacity: Math.min(ramp(p, 0, 0.08), 1 - ramp(p, 0.9, 1)),
      transform: [{ translateX: p * width - SIGNATURE.nib / 2 }],
    };
  });
  return { clip, content, nib };
}

export function signatureFontSize(name: string, width: number): number {
  const { maxSize, minSize, glyphEm, sidePad } = SIGNATURE;
  if (width <= 0 || name.length === 0) return maxSize;
  const fit = (width - sidePad * 2) / (name.length * glyphEm);
  return Math.max(minSize, Math.min(maxSize, Math.floor(fit)));
}
