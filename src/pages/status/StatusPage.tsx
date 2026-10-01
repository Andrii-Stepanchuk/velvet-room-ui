import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HEADER_TOP, PAGE_PADDING_X } from '@/constants/layout';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import type { RootStackParamList } from '@/navigation/navigation.types';
import { ArcanaSheet } from './components/ArcanaSheet/ArcanaSheet';
import { DateHeader } from './components/DateHeader/DateHeader';
import { IdentityBadge } from './components/IdentityBadge/IdentityBadge';
import { MenuButton } from './components/MenuButton';
import { MoonEmblem } from './components/MoonEmblem';
import { QuestCard } from './components/QuestCard';
import { StatRow } from './components/StatRow/StatRow';
import { XpBar } from './components/XpBar';
import { SECTION_GAP } from './config/statusLayout';
import { useArcanaSheet } from './hooks/useArcanaSheet';
import { useMoonHandoff } from './hooks/useMoonHandoff';
import { useMoonSize } from './hooks/useMoonSize';
import { useStatusLayers } from './hooks/useStatusLayers';
import { useStatusModel } from './hooks/useStatusModel';

export function StatusPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Status'>>();
  const { progress, leaving, leave } = useScreenTransition();
  const model = useStatusModel();
  const moonSize = useMoonSize();
  const moonHandoff = useMoonHandoff(progress, moonSize);
  const layers = useStatusLayers(progress);
  const arcanaSheet = useArcanaSheet();
  const openMenu = useCallback(() => leave(() => navigation.navigate('Menu')), [leave, navigation]);

  return (
    <View
      className="flex-1"
      pointerEvents={leaving ? 'none' : 'auto'}
      style={{ paddingTop: insets.top + HEADER_TOP, paddingBottom: insets.bottom + 16, paddingHorizontal: PAGE_PADDING_X }}
    >
      <View className="flex-row items-start justify-between">
        <Animated.View style={layers.header}>
          <DateHeader date={model.now} daysUntilFullMoon={model.daysUntilFullMoon} boosts={model.boosts} />
        </Animated.View>
        <Animated.View style={layers.menuButton}>
          <MenuButton onPress={openMenu} />
        </Animated.View>
      </View>

      <Animated.View onLayout={moonHandoff.onLayout} style={[styles.moon, moonHandoff.style]}>
        <MoonEmblem moon={model.moon} size={moonSize} />
      </Animated.View>

      <Animated.View style={[styles.identity, layers.identity]}>
        <IdentityBadge
          name={model.name}
          level={model.overall.level}
          phaseName={model.moon.name}
          arcana={model.arcana}
          onArcanaPress={arcanaSheet.show}
        />
      </Animated.View>
      <Animated.View style={[styles.xp, layers.xp]}>
        <XpBar xp={model.overall.xp} fraction={model.xpFraction} toNext={model.xpToNext} />
      </Animated.View>
      <Animated.View style={[styles.stats, layers.stats]}>
        <StatRow stats={model.stats} />
      </Animated.View>
      <Animated.View style={[styles.quests, layers.quests]}>
        <QuestCard summary={model.questSummary} message={model.questMessage} />
      </Animated.View>

      {arcanaSheet.open && (
        <ArcanaSheet arcana={model.arcana} progress={arcanaSheet.progress} onClose={arcanaSheet.hide} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  moon: { alignSelf: 'center', marginTop: SECTION_GAP.moonTop },
  identity: { marginTop: SECTION_GAP.identity },
  xp: { marginTop: SECTION_GAP.xp },
  stats: { marginTop: SECTION_GAP.stats },
  quests: { marginTop: SECTION_GAP.quests },
});
