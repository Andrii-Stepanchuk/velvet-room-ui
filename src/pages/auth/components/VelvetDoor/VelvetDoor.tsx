import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors, radius } from '@/constants/theme';
import { glowShadow, withAlpha } from '@/lib/style';
import type { EntranceAnim } from '../../hooks/useEntranceSequence';
import { useVelvetDoorAnimation } from '../../hooks/useVelvetDoorAnimation';
import { DoorHalf } from './DoorHalf';
import { DOOR_H, DOOR_W, HALF_W } from '../../config/doorSize';
import { InnerGlow } from './InnerGlow';

const SEAM = '#beebff';
const INNER_GLOW = glowShadow(colors.glow[300], { opacity: 0.9, radius: 40, elevation: 12 });

export const VelvetDoor = memo(function VelvetDoor({ anim }: { anim: EntranceAnim }) {
  const { container, glow, floor, leftHalf, rightHalf, seam, frame } = useVelvetDoorAnimation(anim);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: '50%',
          top: '41%',
          width: DOOR_W,
          height: DOOR_H,
          marginLeft: -HALF_W,
          marginTop: -DOOR_H / 2,
        },
        container,
      ]}
    >
      <Animated.View
        style={[
          { position: 'absolute', left: HALF_W - 150, top: DOOR_H - 4, width: 300, height: 56 },
          floor,
        ]}
      >
        <Svg width={300} height={56}>
          <Defs>
            <RadialGradient id="floorGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor={colors.glow[500]} stopOpacity={0.34} />
              <Stop offset="0.7" stopColor={colors.glow[500]} stopOpacity={0} />
              <Stop offset="1" stopColor={colors.glow[500]} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width={300} height={56} fill="url(#floorGlow)" />
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 8,
            top: 8,
            ...INNER_GLOW,
          },
          glow,
        ]}
      >
        <InnerGlow />
      </Animated.View>

      <View style={{ position: 'absolute', left: 8, right: 8, top: 8, bottom: 8, flexDirection: 'row' }}>
        <Animated.View style={[{ width: HALF_W - 8, height: '100%', transformOrigin: 'left center' }, leftHalf]}>
          <DoorHalf side="left" />
        </Animated.View>
        <Animated.View style={[{ width: HALF_W - 8, height: '100%', transformOrigin: 'right center' }, rightHalf]}>
          <DoorHalf side="right" />
        </Animated.View>

        <Animated.View
          style={[
            { position: 'absolute', left: '50%', top: 10, bottom: 10, width: 2, marginLeft: -1 },
            seam,
          ]}
        >
          <LinearGradient
            colors={[withAlpha(SEAM, 0), withAlpha(SEAM, 0.85), withAlpha(SEAM, 0.85), withAlpha(SEAM, 0)] as const}
            locations={[0, 0.28, 0.72, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            inset: 0,
            borderRadius: radius.md,
            borderWidth: 4,
            borderColor: withAlpha(colors.accent, 0.7),
          },
          frame,
        ]}
      />
    </Animated.View>
  );
});
