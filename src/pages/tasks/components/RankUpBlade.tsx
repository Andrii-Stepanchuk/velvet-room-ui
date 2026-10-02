import { memo, useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { SkewPanel, StatIcon } from '@/components/ui';
import { colors } from '@/constants/theme';
import { STAT_DEFS } from '@/lib/game';
import { RANK_UP } from '../config/tasksLayout';
import { RANK_UP_TIMING } from '../config/tasksTiming';
import type { RankUp } from '../hooks/useClearFeedback';

export const RankUpBlade = memo(function RankUpBlade({ rankUp, onDone }: { rankUp: RankUp; onDone: () => void }) {
  const { width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const enter = useSharedValue(0);
  const exit = useSharedValue(0);

  useEffect(() => {
    const finish = () => onDone();
    enter.value = 0;
    exit.value = 0;
    if (reducedMotion) {
      enter.value = withTiming(1, { duration: RANK_UP_TIMING.reducedMs });
      exit.value = withDelay(
        RANK_UP_TIMING.holdMs,
        withTiming(1, { duration: RANK_UP_TIMING.reducedMs }, (ok) => ok && scheduleOnRN(finish)),
      );
      return;
    }
    enter.value = withTiming(1, { duration: RANK_UP_TIMING.inMs, easing: Easing.out(Easing.exp) });
    exit.value = withSequence(
      withDelay(
        RANK_UP_TIMING.inMs + RANK_UP_TIMING.holdMs,
        withTiming(1, { duration: RANK_UP_TIMING.outMs, easing: Easing.in(Easing.cubic) }, (ok) => ok && scheduleOnRN(finish)),
      ),
    );
  }, [rankUp.id, reducedMotion, enter, exit, onDone]);

  const style = useAnimatedStyle(() => {
    if (reducedMotion) return { opacity: enter.value * (1 - exit.value) };
    return { transform: [{ translateX: (enter.value - 1) * width + exit.value * width }] };
  });

  const hue = colors.stat[rankUp.stat];
  const name = STAT_DEFS[rankUp.stat].name.toUpperCase();

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, style]}>
      <SkewPanel slant={RANK_UP.slant} fill={colors.textPrimary} shadow={colors.background[700]} className="flex-row items-center" style={styles.blade}>
        <StatIcon stat={rankUp.stat} size={28} color={colors.ink} />
        <View className="ml-4">
          <Text className="font-display text-xs tracking-lg text-ink">RANK UP · {rankUp.level}</Text>
          <Text numberOfLines={1} maxFontSizeMultiplier={1.15} className="font-display-italic text-lg tracking-xs text-ink">
            {name} · {rankUp.rank.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.hueLine, { backgroundColor: hue }]} />
      </SkewPanel>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: -RANK_UP.bleed, right: -RANK_UP.bleed, top: RANK_UP.top },
  blade: { height: RANK_UP.height, paddingLeft: RANK_UP.bleed + 36 },
  hueLine: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3 },
});
