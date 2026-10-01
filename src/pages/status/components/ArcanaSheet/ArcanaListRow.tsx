import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { ARCANA, arcanaFormula, type Arcana } from '@/lib/game';
import { ARCANA_ROW } from '../../config/arcanaSheet';

export const ArcanaListRow = memo(function ArcanaListRow({ arcana, current }: { arcana: Arcana; current: boolean }) {
  const formula = arcanaFormula(arcana);
  const label = `Number ${ARCANA.indexOf(arcana)}, ${arcana.name}, ${formula.replace('▸', 'then')}${current ? ', your Arcana' : ''}`;
  const content = (
    <>
      <Text className={`w-14 font-display-italic text-lg ${current ? 'text-ink' : 'text-tertiary'}`}>
        {arcana.numeral}
      </Text>
      <View className="flex-1">
        <Text numberOfLines={1} className={`font-display-italic text-md ${current ? 'text-ink' : 'text-primary'}`}>
          {arcana.name}
        </Text>
        <Text numberOfLines={1} className={`font-body text-xs ${current ? 'text-background-400' : 'text-muted'}`}>
          {formula}
        </Text>
      </View>
    </>
  );

  if (!current) {
    return (
      <View
        accessible
        accessibilityLabel={label}
        className="flex-row items-center border-b border-accent/10"
        style={styles.row}
      >
        {content}
      </View>
    );
  }

  return (
    <View accessible accessibilityLabel={label}>
      <SkewPanel
        slant={ARCANA_ROW.slant}
        fill={colors.textPrimary}
        className="flex-row items-center"
        style={[styles.row, styles.blade]}
      >
        {content}
        <SkewPanel slant={ARCANA_ROW.tagSlant} fill={colors.ink} className="ml-3 px-2.5 py-0.5">
          <Text className="font-display-italic text-2xs tracking-sm text-primary">YOU</Text>
        </SkewPanel>
      </SkewPanel>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { height: ARCANA_ROW.height },
  blade: {
    marginLeft: -ARCANA_ROW.bleed,
    marginRight: -ARCANA_ROW.bleed,
    paddingLeft: ARCANA_ROW.bleed,
    paddingRight: ARCANA_ROW.bleed,
  },
});
