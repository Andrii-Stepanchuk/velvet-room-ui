import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import type { Arcana } from '@/lib/game';

export const ArcanaLine = memo(function ArcanaLine({ arcana, onPress }: { arcana: Arcana; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={`Arcana ${arcana.name}. Show details`}
      className="mt-1.5"
    >
      <Text className="font-display-medium text-xs tracking-md text-accent">
        {arcana.numeral} · {arcana.name.toUpperCase()} ▸
      </Text>
    </Pressable>
  );
});
