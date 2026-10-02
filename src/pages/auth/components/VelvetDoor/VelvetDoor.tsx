import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import { colors, radius } from '@/constants/theme';
import { glowShadow, withAlpha } from '@/lib/style';
import type { EntranceAnim } from '../../hooks/useEntranceSequence';
import { useVelvetDoorAnimation } from '../../hooks/useVelvetDoorAnimation';
import { DoorHalf } from './DoorHalf';
import { DoorHalo } from './DoorHalo';
import { DOOR_HALO } from '../../config/doorHalo';
import { DOOR_H, DOOR_W, HALF_W } from '../../config/doorSize';
import { InnerGlow } from './InnerGlow';

const SEAM = '#beebff';
const { width: HALO_W, height: HALO_H } = DOOR_HALO.wash;
const INNER_GLOW = glowShadow(colors.glow[300], { opacity: 0.9, radius: 40, elevation: 12 });

export const VelvetDoor = memo(function VelvetDoor({ anim }: { anim: EntranceAnim }) {
  const { container, glow, halo, leftHalf, rightHalf, seam, frame } = useVelvetDoorAnimation(anim);

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
          {
            position: 'absolute',
            left: (DOOR_W - HALO_W) / 2,
            top: (DOOR_H - HALO_H) / 2,
            width: HALO_W,
            height: HALO_H,
          },
          halo,
        ]}
      >
        <DoorHalo />
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
      >
        <View
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius.md - 4,
            borderWidth: 1,
            borderColor: withAlpha(colors.textPrimarySoft, 0.5),
          }}
        />
      </Animated.View>
    </Animated.View>
  );
});
