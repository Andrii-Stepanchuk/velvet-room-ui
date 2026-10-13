import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { formatMonthName } from '@/lib/format';
import { textShade } from '@/lib/style';
import { LOCKUP, TRACK_BAND } from '../../config/trackLayout';
import { bandCenterY, type TrackGeometry } from '../../hooks/useTrackGeometry';
import { useLockupSwap } from '../../hooks/useLockupSwap';

const WIDTH = 200;
const HEIGHT = 72;
const YEAR_STYLE = [textShade, { lineHeight: 36 }];

export const MonthLockup = memo(function MonthLockup({
  date,
  g,
  onPress,
}: {
  date: Date;
  g: TrackGeometry;
  onPress: () => void;
}) {
  const month = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
  const swap = useLockupSwap(month);
  const cx = g.width * LOCKUP.centerX;
  const cy = bandCenterY(cx, g);
  const name = formatMonthName(date);
  return (
    <View style={[css.box, { left: cx - WIDTH / 2, top: cy - HEIGHT / 2 }]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${name.charAt(0)}${name.slice(1).toLowerCase()} ${date.getFullYear()}`}
        accessibilityHint="Opens the month calendar"
        className="flex-1 items-center justify-center"
      >
        {({ pressed }) => (
          <Animated.View style={swap}>
            <View className={`items-center ${pressed ? 'opacity-70' : ''}`}>
              <Text maxFontSizeMultiplier={LOCKUP.maxFontScale} className="font-display-italic text-xl text-white" style={YEAR_STYLE}>
                {date.getFullYear()}
              </Text>
              <View className="flex-row items-center">
                <Text maxFontSizeMultiplier={LOCKUP.maxFontScale} className="font-display text-sm tracking-lg text-primary" style={textShade}>
                  {name}
                </Text>
                <Text maxFontSizeMultiplier={LOCKUP.maxFontScale} className="ml-2 font-display text-md text-accent">
                  ▸
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
});

const css = StyleSheet.create({
  box: { position: 'absolute', width: WIDTH, height: HEIGHT, transform: [{ rotate: `${TRACK_BAND.slant}deg` }] },
});
