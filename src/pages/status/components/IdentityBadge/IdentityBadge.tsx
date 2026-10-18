import { memo } from 'react';
import { Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { Arcana } from '@/lib/game';
import { IDENTITY_NAME } from '../../config/statusLayout';
import { ArcanaLine } from './ArcanaLine';

export const IdentityBadge = memo(function IdentityBadge({
  name,
  level,
  arcana,
  onArcanaPress,
}: {
  name: string;
  level: number;
  arcana: Arcana;
  onArcanaPress: () => void;
}) {
  return (
    <View className="items-center">
      <SkewPanel fill={colors.accent} className="max-w-[86%] px-7 py-1.5">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={IDENTITY_NAME.maxFontScale}
          className="font-display-italic text-md tracking-xs text-ink"
        >
          {`${name.toUpperCase()} · LV ${level}`}
        </Text>
      </SkewPanel>
      <View className="mt-3 w-full items-center">
        <ArcanaLine arcana={arcana} onPress={onArcanaPress} />
      </View>
    </View>
  );
});
