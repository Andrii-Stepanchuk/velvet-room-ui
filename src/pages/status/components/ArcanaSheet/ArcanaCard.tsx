import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { TarotCard } from '@/components/ui';
import type { Arcana } from '@/lib/game';
import { textShade } from '@/lib/style';
import { ARCANA_CARD, ARCANA_HERO } from '../../config/arcanaSheet';
import type { ArcanaSheetLayers } from '../../hooks/useArcanaSheetStyles';
import { BlessingPlate } from './BlessingPlate';
import { EpithetBand } from './EpithetBand';
import { NamePlate } from './NamePlate';

export const ArcanaCard = memo(function ArcanaCard({ arcana, layers }: { arcana: Arcana; layers: ArcanaSheetLayers }) {
  return (
    <View>
      <Animated.View style={layers.band}>
        <EpithetBand epithet={arcana.epithet} />
      </Animated.View>
      <Animated.View style={[styles.plate, layers.plate]}>
        <NamePlate arcana={arcana} />
      </Animated.View>
      <View className="flex-row items-start">
        <Animated.View style={[styles.body, layers.body]}>
          <Text className="font-body text-md leading-6 text-primary" style={textShade}>
            {arcana.description}
          </Text>
        </Animated.View>
        <Animated.View style={[styles.card, layers.card]}>
          <TarotCard arcana={arcana} />
        </Animated.View>
      </View>
      <Animated.View style={[styles.blessing, layers.blessing]}>
        <BlessingPlate arcana={arcana} />
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  plate: { marginTop: ARCANA_HERO.plateTop },
  body: {
    flex: 1,
    marginTop: ARCANA_HERO.bodyTop,
    marginRight: ARCANA_CARD.gap,
  },
  card: { marginTop: -ARCANA_CARD.overlap, marginRight: ARCANA_CARD.edgeInset },
  blessing: { marginTop: ARCANA_HERO.blessingTop },
});
