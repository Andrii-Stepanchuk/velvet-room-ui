import { memo } from 'react';
import { Text, View } from 'react-native';

import { textShade } from '@/lib/style';
import { COUNT_LOCKUP } from '../config/tasksLayout';

const NUMERAL_STYLE = [textShade, { lineHeight: 36 }];

export const CountLockup = memo(function CountLockup({ done, total }: { done: number; total: number }) {
  return (
    <View className="ml-4 items-end" accessible accessibilityLabel={`${done} of ${total} quests cleared today`}>
      <Text maxFontSizeMultiplier={COUNT_LOCKUP.maxFontScale} className="font-display-italic text-xl text-white" style={NUMERAL_STYLE}>
        {done}
        <Text className="text-secondary">/{total}</Text>
      </Text>
      <Text maxFontSizeMultiplier={COUNT_LOCKUP.maxFontScale} className="font-display text-sm tracking-md text-primary" style={textShade}>
        CLEARED TODAY
      </Text>
    </View>
  );
});
