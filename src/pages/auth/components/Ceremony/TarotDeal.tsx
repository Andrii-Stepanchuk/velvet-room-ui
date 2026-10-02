import { memo } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { TarotCard } from '@/components/ui';
import type { Arcana } from '@/lib/game';
import { textShade } from '@/lib/style';
import { DEAL } from '../../config/ceremony';
import type { useCeremonyStyles } from '../../hooks/useCeremonyStyles';

export const TarotDeal = memo(function TarotDeal({
  arcana,
  styles,
}: {
  arcana: Arcana;
  styles: ReturnType<typeof useCeremonyStyles>;
}) {
  return (
    <View
      style={{ height: DEAL.blockHeight }}
      className="items-center"
      accessible
      accessibilityLabel={`Your Arcana: ${arcana.numeral}, ${arcana.name}. ${arcana.epithet}`}
    >
      <Animated.View style={styles.card}>
        <TarotCard arcana={arcana} />
      </Animated.View>
      <Animated.View style={styles.cardCaption} className="mt-6 items-center">
        <Text
          maxFontSizeMultiplier={1.15}
          className="font-display-italic text-md tracking-xs text-white"
          style={textShade}
        >
          ARCANA {arcana.numeral} · {arcana.name.toUpperCase()}
        </Text>
        <Text maxFontSizeMultiplier={1.3} className="mt-1 font-body-italic text-sm text-hint" style={textShade}>
          {arcana.epithet}
        </Text>
      </Animated.View>
    </View>
  );
});
