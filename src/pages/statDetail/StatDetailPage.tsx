import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PageHeader } from '@/components/ui';
import { HEADER_TOP, PAGE_BOTTOM, PAGE_PADDING_X } from '@/constants/layout';
import { colors } from '@/constants/theme';
import { useLunarDay } from '@/hooks/useLunarDay';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import { useProgress } from '@/lib/data/hooks';
import type { RootStackParamList } from '@/navigation/navigation.types';
import { DescriptionPlate } from './components/DescriptionPlate';
import { RankPath } from './components/RankPath/RankPath';
import { StatHero } from './components/StatHero';
import { DETAIL_GAP } from './config/statDetailLayout';
import { DETAIL_SLIDE } from './config/statDetailTiming';
import { useDetailLayer } from './hooks/useDetailLayer';
import { useRingSweep } from './hooks/useRingSweep';
import { useStatDetail } from './hooks/useStatDetail';

export function StatDetailPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'StatDetail'>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'StatDetail'>>();
  const { progress, leaving } = useScreenTransition();
  const { now, moon } = useLunarDay();
  const { overall } = useProgress();
  const detail = useStatDetail(params.stat);
  const sweep = useRingSweep(progress);
  const heroStyle = useDetailLayer(progress, 0, 0, DETAIL_SLIDE.rise);
  const descriptionStyle = useDetailLayer(progress, 1, 0, DETAIL_SLIDE.rise);
  const back = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View
      className="flex-1"
      pointerEvents={leaving ? 'none' : 'auto'}
      style={{
        paddingTop: insets.top + HEADER_TOP,
        paddingBottom: insets.bottom + PAGE_BOTTOM,
      }}
    >
      <View style={styles.padded}>
        <PageHeader date={now} moon={moon} level={overall.level} onBack={back} progress={progress} />
      </View>
      <ScrollView className="flex-1" contentContainerStyle={styles.content}>
        <Animated.View style={heroStyle}>
          <StatHero
            stat={detail.stat}
            def={detail.def}
            rank={detail.rank}
            nextRank={detail.nextRank}
            fraction={detail.fraction}
            toNext={detail.toNext}
            sweep={sweep}
          />
        </Animated.View>
        <Animated.View style={[styles.description, descriptionStyle]}>
          <DescriptionPlate text={detail.def.description} />
        </Animated.View>
        <View style={styles.path}>
          <RankPath path={detail.path} hue={colors.stat[detail.stat.key]} progress={progress} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: PAGE_PADDING_X },
  content: {
    paddingHorizontal: PAGE_PADDING_X,
    paddingTop: DETAIL_GAP.top,
    paddingBottom: DETAIL_GAP.bottom,
  },
  description: { marginTop: DETAIL_GAP.description },
  path: { marginTop: DETAIL_GAP.path },
});
