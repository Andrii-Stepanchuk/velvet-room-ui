import { memo } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { EDGE_TAB_HEIGHT, HEADER_MOON_SIZE } from '@/constants/layout';
import type { MoonState } from '@/lib/game';
import type { LayerStyle } from '@/lib/motion';
import { textShade } from '@/lib/style';
import { MoonDisc } from '../MoonDisc';

const DISC_STYLE = { marginTop: (EDGE_TAB_HEIGHT - HEADER_MOON_SIZE) / 2 };

export const HeaderMoon = memo(function HeaderMoon({
  moon,
  level,
  captionStyle,
}: {
  moon: MoonState;
  level: number;
  captionStyle: LayerStyle;
}) {
  return (
    <View
      accessible
      accessibilityLabel={`${moon.name}, Level ${level}`}
      pointerEvents="none"
      className="items-center"
    >
      <View style={DISC_STYLE}>
        <MoonDisc size={HEADER_MOON_SIZE} illumination={moon.illumination} waxing={moon.waxing} />
      </View>
      <Animated.View style={captionStyle}>
        <View className="mt-1 flex-row items-baseline">
          <Text className="font-display-medium text-2xs tracking-sm text-primary" style={textShade}>
            LV
          </Text>
          <Text className="ml-1 font-display-italic text-md text-white" style={textShade}>
            {level}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
});
