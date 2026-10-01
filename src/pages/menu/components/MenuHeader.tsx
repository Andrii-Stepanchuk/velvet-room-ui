import { memo } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { MoonDisc, PageHeader } from '@/components/ui';
import { MENU_MOON_SIZE, PAGE_PADDING_X } from '@/constants/layout';
import type { MoonState } from '@/lib/game';
import type { LayerStyle } from '@/lib/motion';

export const MenuHeader = memo(function MenuHeader({
  date,
  level,
  moon,
  titleStyle,
  moonStyle,
}: {
  date: Date;
  level: number;
  moon: MoonState;
  titleStyle: LayerStyle;
  moonStyle: LayerStyle;
}) {
  return (
    <View className="flex-row items-start justify-between" style={{ paddingHorizontal: PAGE_PADDING_X }}>
      <Animated.View style={titleStyle}>
        <PageHeader date={date} title="MENU" />
      </Animated.View>
      <Animated.View style={[{ alignItems: 'center' }, moonStyle]}>
        <MoonDisc size={MENU_MOON_SIZE} illumination={moon.illumination} waxing={moon.waxing} />
        <Text className="mt-1.5 font-display-italic text-lg text-white">LV {level}</Text>
      </Animated.View>
    </View>
  );
});
