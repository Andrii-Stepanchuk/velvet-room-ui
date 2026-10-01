import { memo } from 'react';
import { View } from 'react-native';

import { MoonDisc } from '@/components/ui';
import { colors } from '@/constants/theme';
import { fullMoonProgress, type MoonState } from '@/lib/game';
import { glowShadow, withAlpha } from '@/lib/style';
import { MOON_DISC_RATIO, MOON_RING_WIDTH } from '../config/statusLayout';
import { ProgressRing } from './ProgressRing';

const DISC_GLOW = glowShadow(colors.glow[300], { opacity: 0.5, radius: 30, elevation: 12 });
const RING_TRACK = withAlpha(colors.accent, 0.12);

export const MoonEmblem = memo(function MoonEmblem({ moon, size }: { moon: MoonState; size: number }) {
  const disc = size * MOON_DISC_RATIO;
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <ProgressRing
        size={size}
        strokeWidth={MOON_RING_WIDTH}
        progress={fullMoonProgress(moon)}
        color={colors.accent}
        trackColor={RING_TRACK}
      />
      <View style={[DISC_GLOW, { width: disc, height: disc, borderRadius: disc / 2, backgroundColor: colors.ink }]}>
        <MoonDisc size={disc} illumination={moon.illumination} waxing={moon.waxing} />
      </View>
    </View>
  );
});
