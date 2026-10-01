import { memo } from 'react';
import Animated from 'react-native-reanimated';

import { SoftGlow } from '@/components/ui';
import type { LayerStyle } from '@/lib/motion';
import { BOOST_FX } from '../../config/boostFx';

const MOONLIGHT = '#dfe8ff';

export const MoonCorona = memo(function MoonCorona({ size, style }: { size: number; style: LayerStyle }) {
  const corona = size * BOOST_FX.coronaRatio;
  const offset = (size - corona) / 2;
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: offset, left: offset }, style]}>
      <SoftGlow width={corona} height={corona} color={MOONLIGHT} opacity={0.95} />
    </Animated.View>
  );
});
