import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';

import { MoonDisc } from '@/components/ui';
import { colors } from '@/constants/theme';
import { getMoonState, isFullMoonDay, parseDay, type DayKey } from '@/lib/game';
import { formatWeekday } from '@/lib/format';
import { textShade, withAlpha } from '@/lib/style';
import { TRACK_NODE } from '../../config/trackLayout';
import type { TrackGeometry } from '../../hooks/useTrackGeometry';
import { useTrackNode } from '../../hooks/useTrackNode';

const NUMERAL_STYLE = [textShade, { fontSize: TRACK_NODE.numeral, lineHeight: TRACK_NODE.numeralLine }];

export const TrackNode = memo(function TrackNode({
  day,
  index,
  isToday,
  future,
  scroll,
  progress,
  g,
}: {
  day: DayKey;
  index: number;
  isToday: boolean;
  future: boolean;
  scroll: SharedValue<number>;
  progress: SharedValue<number>;
  g: TrackGeometry;
}) {
  const { date, moon, full } = useMemo(() => {
    const d = parseDay(day);
    return { date: d, moon: getMoonState(d), full: isFullMoonDay(d) };
  }, [day]);
  const styles = useTrackNode(scroll, progress, index, future, g);

  return (
    <Animated.View pointerEvents="none" style={[css.box, styles.node]}>
      <Animated.View style={[css.label, styles.label]}>
        <Text maxFontSizeMultiplier={TRACK_NODE.maxFontScale} className="font-display-italic text-white" style={NUMERAL_STYLE}>
          {date.getDate()}
        </Text>
        <View className="mb-2 ml-1.5 items-start">
          <Text
            maxFontSizeMultiplier={TRACK_NODE.maxFontScale}
            className={`font-display text-xs tracking-sm ${isToday ? 'text-white' : 'text-secondary'}`}
            style={textShade}
          >
            {formatWeekday(date)}
          </Text>
          <View style={[css.stripe, { backgroundColor: isToday ? colors.textPrimary : colors.accent }]} />
        </View>
      </Animated.View>
      <View style={css.moonBox}>
        <Animated.View style={[css.ring, styles.ring]} />
        <Animated.View style={styles.moon}>
          <MoonDisc size={TRACK_NODE.moon} illumination={moon.illumination} waxing={moon.waxing} />
          <Animated.View style={[css.veil, styles.veil]} />
          <View style={css.rim} />
          {full && <View style={css.marker} />}
        </Animated.View>
      </View>
    </Animated.View>
  );
});

const css = StyleSheet.create({
  box: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: TRACK_NODE.boxWidth,
    height: TRACK_NODE.boxHeight,
  },
  label: {
    position: 'absolute',
    right: TRACK_NODE.ring + TRACK_NODE.labelGap,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    transformOrigin: 'right center',
  },
  moonBox: {
    position: 'absolute',
    right: 0,
    top: (TRACK_NODE.boxHeight - TRACK_NODE.ring) / 2,
    width: TRACK_NODE.ring,
    height: TRACK_NODE.ring,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: TRACK_NODE.ring,
    height: TRACK_NODE.ring,
    borderRadius: TRACK_NODE.ring / 2,
    borderWidth: TRACK_NODE.ringWidth,
    borderColor: colors.textPrimary,
  },
  veil: {
    position: 'absolute',
    width: TRACK_NODE.moon,
    height: TRACK_NODE.moon,
    borderRadius: TRACK_NODE.moon / 2,
    backgroundColor: colors.background[700],
  },
  rim: {
    position: 'absolute',
    width: TRACK_NODE.moon,
    height: TRACK_NODE.moon,
    borderRadius: TRACK_NODE.moon / 2,
    borderWidth: TRACK_NODE.rimWidth,
    borderColor: withAlpha(colors.textPrimary, TRACK_NODE.rimAlpha),
  },
  marker: {
    position: 'absolute',
    top: -TRACK_NODE.marker / 2,
    left: (TRACK_NODE.moon - TRACK_NODE.marker) / 2,
    width: TRACK_NODE.marker,
    height: TRACK_NODE.marker,
    backgroundColor: colors.accent,
    transform: [{ rotate: '45deg' }],
  },
  stripe: { marginTop: 3, height: 2, alignSelf: 'stretch' },
});
