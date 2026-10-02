import { memo } from 'react';
import Animated, { type SharedValue } from 'react-native-reanimated';

import { SectionLabel } from '@/components/ui';
import type { RankStep } from '@/lib/game';
import { DETAIL_GAP } from '../../config/statDetailLayout';
import { DETAIL_SLIDE } from '../../config/statDetailTiming';
import { useDetailLayer } from '../../hooks/useDetailLayer';
import { RankRow } from './RankRow';

const FIRST_ROW_LAYER = 3;

export const RankPath = memo(function RankPath({
  path,
  hue,
  progress,
}: {
  path: readonly RankStep[];
  hue: string;
  progress: SharedValue<number>;
}) {
  const labelStyle = useDetailLayer(progress, FIRST_ROW_LAYER - 1, 0, DETAIL_SLIDE.rise);
  return (
    <>
      <Animated.View style={[{ marginBottom: DETAIL_GAP.label }, labelStyle]}>
        <SectionLabel label="RANK PATH" />
      </Animated.View>
      {path.map((step, index) => (
        <RankRow key={step.rank} step={step} hue={hue} layer={FIRST_ROW_LAYER + index} progress={progress} />
      ))}
    </>
  );
});
