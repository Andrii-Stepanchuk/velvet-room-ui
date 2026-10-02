import { memo } from 'react';
import { Text, View } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import Check from 'lucide-react-native/icons/check';

import type { RankStep } from '@/lib/game';
import { DETAIL_SLIDE } from '../../config/statDetailTiming';
import { RANK_ROW } from '../../config/statDetailLayout';
import { useDetailLayer } from '../../hooks/useDetailLayer';
import { CurrentBlade } from './CurrentBlade';
import { RankTile } from './RankTile';

const STATE_LABEL = {
  done: 'reached',
  current: 'current rank',
  locked: 'locked',
} as const;
const NAME_CLASS = {
  done: 'font-body-medium text-secondary',
  current: 'font-body-bold text-white',
  locked: 'font-body-medium text-disabled',
} as const;
const ROW_STYLE = { height: RANK_ROW.height };
const LOCKED_STYLE = { opacity: RANK_ROW.lockedOpacity };
const DIAMOND_STYLE = {
  width: RANK_ROW.diamond,
  height: RANK_ROW.diamond,
  transform: [{ rotate: '45deg' }],
};

export const RankRow = memo(function RankRow({
  step,
  hue,
  layer,
  progress,
}: {
  step: RankStep;
  hue: string;
  layer: number;
  progress: SharedValue<number>;
}) {
  const style = useDetailLayer(progress, layer, DETAIL_SLIDE.row, 0);
  const locked = step.state === 'locked';
  return (
    <Animated.View style={style}>
      <View
        accessible
        accessibilityLabel={`Rank ${step.rank}, ${step.name}, ${STATE_LABEL[step.state]}`}
        className="flex-row items-center"
        style={ROW_STYLE}
      >
        {step.state === 'current' && <CurrentBlade />}
        <View className="flex-1 flex-row items-center" style={locked && LOCKED_STYLE}>
          <RankTile rank={step.rank} state={step.state} hue={hue} />
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={RANK_ROW.maxFontScale}
            className={`ml-4 flex-1 text-md ${NAME_CLASS[step.state]}`}
          >
            {step.name}
          </Text>
          {step.state === 'done' && <Check size={RANK_ROW.check} color={hue} strokeWidth={2.4} />}
          {step.state === 'current' && <View style={[DIAMOND_STYLE, { backgroundColor: hue }]} />}
        </View>
      </View>
    </Animated.View>
  );
});
