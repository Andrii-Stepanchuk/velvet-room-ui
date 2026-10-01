import { memo } from 'react';
import { View } from 'react-native';

import { MoonDisc } from '@/components/ui';
import { colors } from '@/constants/theme';
import { moonDialLabel } from '@/lib/format';
import type { MoonState } from '@/lib/game';
import { glowShadow } from '@/lib/style';
import { MOON_DISC_RATIO } from '../../config/statusLayout';
import { MoonDial } from './MoonDial';

const DISC_GLOW = glowShadow(colors.glow[300], { opacity: 0.5, radius: 30, elevation: 12 });

export const MoonEmblem = memo(function MoonEmblem({
  moon,
  size,
  daysUntilFullMoon,
}: {
  moon: MoonState;
  size: number;
  daysUntilFullMoon: number;
}) {
  const disc = size * MOON_DISC_RATIO;
  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
      accessible
      accessibilityRole="image"
      accessibilityLabel={moonDialLabel(moon.name, daysUntilFullMoon)}
    >
      <MoonDial size={size} moon={moon} />
      <View style={[DISC_GLOW, { width: disc, height: disc, borderRadius: disc / 2, backgroundColor: colors.ink }]}>
        <MoonDisc size={disc} illumination={moon.illumination} waxing={moon.waxing} />
      </View>
    </View>
  );
});
