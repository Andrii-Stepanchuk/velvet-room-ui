import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { arcanaFormula, type Arcana } from '@/lib/game';
import { textGlow, withAlpha } from '@/lib/style';
import { ARCANA_BLESSING } from '../../config/arcanaSheet';

const FILL = withAlpha(colors.background[700], 0.9);
const STROKE = withAlpha(colors.accent, 0.22);
const SLIVER = withAlpha(colors.accent, 0.28);

export const BlessingPlate = memo(function BlessingPlate({ arcana }: { arcana: Arcana }) {
  return (
    <SkewPanel slant={ARCANA_BLESSING.slant} fill={FILL} stroke={STROKE} className="pb-5 pt-8" style={styles.plate}>
      <View style={styles.heading}>
        <SkewPanel slant={ARCANA_BLESSING.sliverSlant} fill={SLIVER} style={styles.sliver} />
        <Text
          accessibilityLabel={`Formed by ${arcanaFormula(arcana).replace('▸', 'then')}`}
          numberOfLines={1}
          adjustsFontSizeToFit
          className="font-display-italic text-lg text-accent"
          style={textGlow}
        >
          {arcanaFormula(arcana)}
        </Text>
      </View>
      <Text className="font-display-medium text-2xs tracking-lg text-muted">BLESSING · DORMANT</Text>
      <Text className="mt-1.5 font-body text-md leading-6 text-primary">{arcana.blessing}</Text>
    </SkewPanel>
  );
});

const styles = StyleSheet.create({
  plate: {
    marginLeft: ARCANA_BLESSING.indent,
    marginRight: -ARCANA_BLESSING.bleed,
    paddingLeft: ARCANA_BLESSING.paddingLeft,
    paddingRight: ARCANA_BLESSING.bleed,
  },
  heading: {
    position: 'absolute',
    top: ARCANA_BLESSING.headingTop,
    left: ARCANA_BLESSING.headingLeft,
    maxWidth: '84%',
  },
  sliver: {
    position: 'absolute',
    left: -ARCANA_BLESSING.sliverOverhang,
    right: 0,
    bottom: 1,
    height: ARCANA_BLESSING.sliverHeight,
  },
});
