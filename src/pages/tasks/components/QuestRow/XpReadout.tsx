import { memo, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
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

import { textGlow } from '@/lib/style';
import { STAT_TEXT_CLASS } from '@/lib/statStyle';
import type { Readout } from '../../hooks/useClearFeedback';
import { XP_READOUT } from '../../config/tasksTiming';

export const XpReadout = memo(function XpReadout({ readout, onDone }: { readout: Readout; onDone: () => void }) {
  const reducedMotion = useReducedMotion();
  const t = useSharedValue(0);
  const fade = useSharedValue(0);

  useEffect(() => {
    const finish = () => onDone();
    if (reducedMotion) {
      fade.value = withSequence(
        withTiming(1, { duration: XP_READOUT.reducedMs }),
        withDelay(XP_READOUT.holdMs, withTiming(0, { duration: XP_READOUT.reducedMs }, (ok) => ok && scheduleOnRN(finish))),
      );
      return;
    }
    t.value = withTiming(1, { duration: XP_READOUT.inMs + XP_READOUT.holdMs, easing: Easing.out(Easing.exp) });
    fade.value = withSequence(
      withTiming(1, { duration: XP_READOUT.inMs }),
      withDelay(XP_READOUT.holdMs, withTiming(0, { duration: XP_READOUT.outMs }, (ok) => ok && scheduleOnRN(finish))),
    );
  }, [readout.id, reducedMotion, t, fade, onDone]);

  const style = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: -XP_READOUT.rise * t.value }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, style]}>
      <Text
        importantForAccessibility="no"
        className={`font-display-italic text-md tracking-xs ${readout.gain ? STAT_TEXT_CLASS[readout.stat] : 'text-secondary'}`}
        style={textGlow}
      >
        {readout.text}
      </Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: 22, top: 14 },
});
