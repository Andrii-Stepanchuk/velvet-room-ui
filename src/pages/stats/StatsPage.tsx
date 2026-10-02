import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PageHeader } from '@/components/ui';
import { HEADER_TOP, PAGE_BOTTOM, PAGE_PADDING_X } from '@/constants/layout';
import { useLunarDay } from '@/hooks/useLunarDay';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import { useProgress } from '@/lib/data/hooks';
import type { RootStackParamList } from '@/navigation/navigation.types';
import { StatPlateLayer } from './components/StatPlateLayer';
import { StatsHint } from './components/StatsHint';
import { STATS_GAP } from './config/statsLayout';
import { useStatSelection } from './hooks/useStatSelection';

export function StatsPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Stats'>>();
  const { progress, leaving, leave } = useScreenTransition();
  const { now, moon } = useLunarDay();
  const { overall, stats } = useProgress();
  const selection = useStatSelection(leave);
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
        <PageHeader date={now} title="STATS" moon={moon} level={overall.level} onBack={back} progress={progress} />
      </View>
      <ScrollView className="flex-1" contentContainerStyle={styles.content}>
        {stats.map((stat, index) => (
          <StatPlateLayer
            key={stat.key}
            stat={stat}
            index={index}
            selected={stat.key === selection.selected}
            progress={progress}
            onOpen={selection.open}
          />
        ))}
        <StatsHint stats={stats} progress={progress} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: PAGE_PADDING_X },
  content: {
    paddingHorizontal: PAGE_PADDING_X,
    paddingTop: STATS_GAP.top,
    paddingBottom: STATS_GAP.bottom,
  },
});
