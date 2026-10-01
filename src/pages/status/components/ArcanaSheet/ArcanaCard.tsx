import { memo } from 'react';
import { Text, View } from 'react-native';

import { arcanaFormula, type Arcana } from '@/lib/game';
import { skewX, textGlow } from '@/lib/style';
import { ArcanaInfoRow } from './ArcanaInfoRow';

const NAME_STYLE = [skewX(-6), textGlow];

export const ArcanaCard = memo(function ArcanaCard({ arcana }: { arcana: Arcana }) {
  return (
    <View className="items-center">
      <Text className="font-display-medium text-xs tracking-xl text-secondary">YOUR ARCANA</Text>
      <Text className="mt-3 font-display-italic text-2xl text-accent" style={textGlow}>
        {arcana.numeral}
      </Text>
      <Text className="mt-1 font-display-italic text-xl text-white" style={NAME_STYLE}>
        {arcana.name.toUpperCase()}
      </Text>
      <Text className="mt-1 font-body-italic text-md text-hint">{arcana.epithet}</Text>
      <Text className="mt-4 text-center font-body text-md text-primary">{arcana.description}</Text>
      <View className="mt-5 w-full gap-3">
        <ArcanaInfoRow label="FORMED BY" value={arcanaFormula(arcana)} />
        <ArcanaInfoRow label="BLESSING · DORMANT" value={arcana.blessing} />
      </View>
    </View>
  );
});
