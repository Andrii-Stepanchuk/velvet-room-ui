import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { SoftGlow } from '@/components/ui';
import { colors } from '@/constants/theme';
import { MOON_GLOW, RADAR } from '../../config/trackLayout';
import type { TrackGeometry } from '../../hooks/useTrackGeometry';
import { useRadar, useRadarWave } from '../../hooks/useRadar';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Wave = memo(function Wave({
  wave,
  index,
  looping,
  scale,
  center,
}: {
  wave: SharedValue<number>;
  index: number;
  looping: boolean;
  scale: number;
  center: number;
}) {
  const props = useRadarWave(wave, index, looping, scale);
  return <AnimatedCircle cx={center} cy={center} fill="none" stroke={colors.accent} animatedProps={props} />;
});

export const RadarRings = memo(function RadarRings({
  selected,
  moving,
  progress,
  g,
}: {
  selected: string;
  moving: SharedValue<number>;
  progress: SharedValue<number>;
  g: TrackGeometry;
}) {
  const { field, glow, waves, looping } = useRadar(selected, moving, progress);
  const size = 2 * (RADAR.to * g.scale + RADAR.pad);
  const halo = MOON_GLOW.size * g.scale;
  return (
    <Animated.View pointerEvents="none" style={[css.field, { left: g.fx, top: g.fy }, field]}>
      <Animated.View style={[css.layer, { width: halo, height: halo, marginLeft: -halo / 2, marginTop: -halo / 2 }, glow]}>
        <SoftGlow width={halo} height={halo} color={colors.glow[300]} opacity={MOON_GLOW.swell} />
      </Animated.View>
      <Svg width={size} height={size} style={[css.layer, { marginLeft: -size / 2, marginTop: -size / 2 }]}>
        {waves.map((wave, i) => (
          <Wave key={i} wave={wave} index={i} looping={looping} scale={g.scale} center={size / 2} />
        ))}
      </Svg>
    </Animated.View>
  );
});

const css = StyleSheet.create({
  field: { position: 'absolute', width: 0, height: 0 },
  layer: { position: 'absolute', left: 0, top: 0 },
});
