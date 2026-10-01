import { memo } from 'react';
import { Text, View } from 'react-native';

import { arcanaFormula, type Arcana } from '@/lib/game';

export const ArcanaListRow = memo(function ArcanaListRow({ arcana, current }: { arcana: Arcana; current: boolean }) {
  return (
    <View className={`flex-row items-center border-b border-accent/10 px-2 py-3 ${current ? 'bg-accent/10' : ''}`}>
      <Text className={`w-12 font-display-italic text-md ${current ? 'text-accent' : 'text-tertiary'}`}>
        {arcana.numeral}
      </Text>
      <View className="flex-1">
        <Text className={`font-display-medium text-sm tracking-xs ${current ? 'text-white' : 'text-primary'}`}>
          {arcana.name.toUpperCase()}
        </Text>
        <Text className="mt-0.5 font-body text-xs text-muted">{arcanaFormula(arcana)}</Text>
      </View>
      {current && <Text className="font-display-medium text-2xs tracking-md text-accent">YOU</Text>}
    </View>
  );
});
