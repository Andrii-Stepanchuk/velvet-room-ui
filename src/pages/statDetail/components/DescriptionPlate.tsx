import { memo } from 'react';
import { Text, View } from 'react-native';

import { DESCRIPTION_PLATE } from '../config/statDetailLayout';

const PLATE_STYLE = {
  paddingHorizontal: DESCRIPTION_PLATE.padX,
  paddingVertical: DESCRIPTION_PLATE.padY,
};
const TEXT_STYLE = { lineHeight: DESCRIPTION_PLATE.lineHeight };

export const DescriptionPlate = memo(function DescriptionPlate({ text }: { text: string }) {
  return (
    <View className="border border-accent/20 bg-background-700/70" style={PLATE_STYLE}>
      <Text className="font-body text-md text-primary" style={TEXT_STYLE}>
        {text}
      </Text>
    </View>
  );
});
