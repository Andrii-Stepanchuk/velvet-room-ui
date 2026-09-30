import { memo } from 'react';
import { Text, View } from 'react-native';

import { textGlow } from '@/lib/style';

export const TITLE_STYLE = [{ transform: [{ skewX: '-6deg' }] }, textGlow];

export const TitleBlock = memo(function TitleBlock() {
  return (
    <View className="items-center">
      <Text className="font-display-italic text-xl tracking-2xl text-primary" style={TITLE_STYLE}>
        Velvet Room
      </Text>
      <Text className="mt-1 font-display-medium text-2xs tracking-lg text-secondary">SELF-IMPROVEMENT RPG</Text>
    </View>
  );
});
