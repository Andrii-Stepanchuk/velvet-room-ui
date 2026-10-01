import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';

import { MoonDisc } from '@/components/ui';
import { colors } from '@/constants/theme';
import { moonDialLabel } from '@/lib/format';
import type { Boosts, LunarCycle, MoonState } from '@/lib/game';
import type { LayerStyle } from '@/lib/motion';
import { glowShadow } from '@/lib/style';
import { MOON_DISC_RATIO } from '../../config/statusLayout';
import { dialAngle, dialBand } from '../../hooks/useMoonDial';
import { useMoonAura } from '../../hooks/useMoonAura';
import { DialSweep } from './DialSweep';
import { MoonCorona } from './MoonCorona';
import { MoonDial } from './MoonDial';

const DISC_GLOW = glowShadow(colors.glow[300], { opacity: 0.5, radius: 30, elevation: 12 });

export const MoonEmblem = memo(function MoonEmblem({
  moon,
  cycle,
  size,
  daysUntilFullMoon,
  boosts,
  progress,
  dialStyle,
}: {
  moon: MoonState;
  cycle: LunarCycle;
  size: number;
  daysUntilFullMoon: number;
  boosts: Boosts;
  progress: SharedValue<number>;
  dialStyle: LayerStyle;
}) {
  const disc = size * MOON_DISC_RATIO;
  const band = dialBand(size);
  const aura = useMoonAura(progress, boosts, dialAngle(cycle.newMoonIndex / cycle.length));
  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
      accessible
      accessibilityRole="image"
      accessibilityLabel={moonDialLabel(moon.name, daysUntilFullMoon)}
    >
      {aura.intensity > 0 && <MoonCorona size={size} style={aura.corona} />}
      <Animated.View pointerEvents="none" style={[styles.dial, dialStyle]}>
        <MoonDial size={size} cycle={cycle} fullMoon={boosts.fullMoon} />
        {boosts.fullMoon && <DialSweep size={size} radius={band.radius} width={band.width} style={aura.sweep} />}
        <View style={[DISC_GLOW, { width: disc, height: disc, borderRadius: disc / 2, backgroundColor: colors.ink }]} />
      </Animated.View>
      <MoonDisc size={disc} illumination={moon.illumination} waxing={moon.waxing} />
    </View>
  );
});

const styles = StyleSheet.create({
  dial: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
