import { memo } from 'react';
import { Text, View } from 'react-native';

import { TITLE_STYLE } from './TitleBlock';

export const WelcomeBlock = memo(function WelcomeBlock({ name }: { name: string }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-display-medium text-xs tracking-xl text-secondary">WELCOME</Text>
      <Text className="mt-2 font-display-italic text-2xl tracking-sm text-white" style={TITLE_STYLE}>
        {name.toUpperCase()}
      </Text>
    </View>
  );
});
