import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { ARCANA, type Arcana } from '@/lib/game';
import { ARCANA_PLATE } from '../../config/arcanaSheet';
import { ArcanaPips } from './ArcanaPips';

export const NamePlate = memo(function NamePlate({ arcana }: { arcana: Arcana }) {
  const index = ARCANA.indexOf(arcana);
  return (
    <SkewPanel slant={ARCANA_PLATE.slant} fill={colors.textPrimary} className="pb-4 pt-6" style={styles.plate}>
      <View style={styles.tag} importantForAccessibility="no-hide-descendants">
        <SkewPanel slant={ARCANA_PLATE.tagSlant} fill={colors.ink} className="px-3 py-0.5">
          <Text className="font-display-italic text-xs tracking-sm text-primary">YOU</Text>
        </SkewPanel>
      </View>
      <View className="flex-row items-center">
        <Text
          accessibilityRole="header"
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          className="flex-1 font-display-italic text-2xl text-ink"
          style={styles.name}
        >
          {arcana.name}
        </Text>
        <View accessible accessibilityLabel={`Number ${index}`} className="ml-3 flex-row items-center">
          <Text className="mr-2 font-display text-sm tracking-xs text-ink">NO.</Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.15}
            className="font-display-italic text-3xl text-ink"
            style={styles.numeral}
          >
            {arcana.numeral}
          </Text>
        </View>
      </View>
      <ArcanaPips index={index} count={ARCANA.length} className="mt-2.5 w-2/3" />
    </SkewPanel>
  );
});

const styles = StyleSheet.create({
  plate: {
    marginLeft: -ARCANA_PLATE.bleed,
    marginRight: -ARCANA_PLATE.endInset,
    paddingLeft: ARCANA_PLATE.bleed,
    paddingRight: 28,
  },
  tag: {
    position: 'absolute',
    top: ARCANA_PLATE.tagTop,
    left: ARCANA_PLATE.bleed - ARCANA_PLATE.tagInset,
    transform: [{ rotate: `${ARCANA_PLATE.tagRotate}deg` }],
  },
  name: { lineHeight: ARCANA_PLATE.nameLineHeight },
  numeral: {
    lineHeight: ARCANA_PLATE.numeralLineHeight,
    maxWidth: ARCANA_PLATE.numeralMaxWidth,
  },
});
