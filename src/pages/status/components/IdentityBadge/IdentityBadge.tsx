import { memo } from 'react';
import { Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { Arcana } from '@/lib/game';
import { ArcanaLine } from './ArcanaLine';

export const IdentityBadge = memo(function IdentityBadge({
  name,
  level,
  phaseName,
  arcana,
  onArcanaPress,
}: {
  name: string;
  level: number;
  phaseName: string;
  arcana: Arcana;
  onArcanaPress: () => void;
}) {
  return (
    <View className="items-center">
      <SkewPanel fill={colors.accent} className="max-w-[86%] px-7 py-1.5">
        <Text numberOfLines={1} adjustsFontSizeToFit className="font-display-italic text-md tracking-xs text-ink">
          {`${name.toUpperCase()} · LV ${level}`}
        </Text>
      </SkewPanel>
      <Text className="mb-2.5 mt-3 font-display-medium text-2xs tracking-lg text-secondary">{phaseName.toUpperCase()}</Text>
      <ArcanaLine arcana={arcana} onPress={onArcanaPress} />
    </View>
  );
});
