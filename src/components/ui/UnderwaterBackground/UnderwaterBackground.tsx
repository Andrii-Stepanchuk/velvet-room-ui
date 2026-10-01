import { memo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { useDrift } from '@/hooks/useDrift';
import { useLunarDay } from '@/hooks/useLunarDay';
import { SoftGlow } from '../SoftGlow';
import { DarkHourVeil } from './DarkHourVeil';

const WATER_COLORS = ['#1fd8e6', '#14a6dd', '#0e6fcf', '#0a44ab', '#072a7d', '#051a52', colors.background[800]] as const;
const WATER_LOCATIONS = [0, 0.09, 0.22, 0.4, 0.6, 0.78, 1] as const;

export const UnderwaterBackground = memo(function UnderwaterBackground() {
  const { width, height } = useWindowDimensions();
  const causticA = useDrift(width * 0.06, 14000);
  const causticB = useDrift(width * 0.06, 19000, 3000);
  const fog = useDrift(width * 0.05, 15000, 1000);
  const { boosts } = useLunarDay();

  return (
    <>
      <LinearGradient
        colors={WATER_COLORS}
        locations={WATER_LOCATIONS}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        pointerEvents="none"
        style={{ position: 'absolute', top: -height * 0.14, left: width * 0.5 - width * 0.6, width: width * 1.2 }}
      >
        <SoftGlow width={width * 1.2} height={height * 0.42} color="#5df0ff" opacity={0.55} />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: -height * 0.02, left: -width * 0.14, width: width * 1.28 }, causticA]}
      >
        <SoftGlow width={width * 0.6} height={height * 0.16} color="#78fff6" opacity={0.6} />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          { position: 'absolute', top: height * 0.04, left: width * 0.32, width: width * 0.6 },
          causticB,
        ]}
      >
        <SoftGlow width={width * 0.55} height={height * 0.14} color="#60f0ff" opacity={0.5} />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: height * 0.22, left: -width * 0.2, width: width * 1.4 }, fog]}
      >
        <SoftGlow width={width * 1.2} height={height * 0.4} color="#5aaaff" opacity={0.16} />
      </Animated.View>

      <DarkHourVeil active={boosts.darkHour} width={width} height={height} />

      <LinearGradient
        pointerEvents="none"
        colors={[withAlpha(colors.background[900], 0), withAlpha(colors.background[900], 0.85)] as const}
        locations={[0.5, 1]}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: height * 0.46 }}
      />
    </>
  );
});
