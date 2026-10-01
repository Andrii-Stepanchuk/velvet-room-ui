import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { ARCANA_BAND } from '../../config/arcanaSheet';

export const EpithetBand = memo(function EpithetBand({ epithet }: { epithet: string }) {
  return (
    <SkewPanel slant={ARCANA_BAND.slant} fill={colors.ink} className="items-center justify-center" style={styles.band}>
      <Text numberOfLines={1} className="font-body-italic text-lg text-white">
        {epithet}
      </Text>
    </SkewPanel>
  );
});

const styles = StyleSheet.create({
  band: {
    height: ARCANA_BAND.height,
    marginLeft: -ARCANA_BAND.bleed,
    marginRight: ARCANA_BAND.endInset,
    paddingLeft: ARCANA_BAND.bleed,
    paddingRight: 24,
  },
});
