import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { PAGE_PADDING_X } from '@/constants/layout';
import { useProgress } from '@/lib/data/hooks';
import { DEAL } from '../../config/ceremony';
import { useCeremonyStyles } from '../../hooks/useCeremonyStyles';
import type { EntranceAnim } from '../../hooks/useEntranceSequence';
import { ContractPlate } from './ContractPlate';
import { TarotDeal } from './TarotDeal';

export const Ceremony = memo(function Ceremony({ name, anim }: { name: string; anim: EntranceAnim }) {
  const { arcana } = useProgress();
  const styles = useCeremonyStyles(anim);

  return (
    <View style={[StyleSheet.absoluteFill, { paddingHorizontal: PAGE_PADDING_X, justifyContent: 'center' }]}>
      <Animated.View style={styles.plate}>
        <ContractPlate name={name} anim={anim} styles={styles} />
      </Animated.View>
      <View style={{ marginTop: DEAL.gap }}>
        <TarotDeal arcana={arcana} styles={styles} />
      </View>
    </View>
  );
});
