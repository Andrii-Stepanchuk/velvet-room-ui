import { useCallback, useMemo } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DateTab } from '@/components/ui';
import { HEADER_TOP, PAGE_BOTTOM, PAGE_PADDING_X } from '@/constants/layout';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import { useSheet } from '@/hooks/useSheet';
import type { StatKey } from '@/lib/game';
import type { RootStackParamList } from '@/navigation/navigation.types';
import { ArcanaSheet } from './components/ArcanaSheet/ArcanaSheet';
import { CountdownLockup } from './components/CountdownLockup';
import { IdentityBadge } from './components/IdentityBadge/IdentityBadge';
import { MenuButton } from './components/MenuButton';
import { MoonCaption } from './components/MoonCaption';
import { MoonEmblem } from './components/MoonEmblem/MoonEmblem';
import { QuestCard } from './components/QuestCard';
import { StatRow } from './components/StatRow/StatRow';
import { XpBar } from './components/XpBar';
import { ARCANA_SHEET } from './config/arcanaSheet';
import { SECTION_GAP } from './config/statusLayout';
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
  const moonHandoff = useMoonHandoff(progress, moonSize.size);
  const moonStage = useMemo(() => [styles.moonStage, { flexBasis: moonSize.ideal }], [moonSize.ideal]);
  const { onLayout: measureMoon } = moonSize;
  const { onLayout: anchorMoon } = moonHandoff;
  const onMoonLayout = useCallback(
    (e: LayoutChangeEvent) => {
      measureMoon(e);
      anchorMoon(e);
    },
    [measureMoon, anchorMoon],
  );
  const layers = useStatusLayers(progress);
  const arcanaSheet = useSheet(ARCANA_SHEET);
  const openMenu = useCallback(() => leave(() => navigation.navigate('Menu')), [leave, navigation]);
  const openTasks = useCallback(() => leave(() => navigation.navigate('Tasks')), [leave, navigation]);
  const openStat = useCallback(
    (stat: StatKey) => leave(() => navigation.navigate('StatDetail', { stat })),
    [leave, navigation],
  );

  return (
    <View
      className="flex-1"
      pointerEvents={leaving ? 'none' : 'auto'}
      style={{
        paddingTop: insets.top + HEADER_TOP,
        paddingBottom: insets.bottom + PAGE_BOTTOM,
        paddingHorizontal: PAGE_PADDING_X,
      }}
    >
      <View className="flex-1" importantForAccessibility={arcanaSheet.open ? 'no-hide-descendants' : 'auto'}>
        <View className="flex-row items-start justify-between">
          <Animated.View onLayout={moonHandoff.onDateTabLayout} style={layers.dateTab}>
            <DateTab date={model.now} />
          </Animated.View>
          <Animated.View onLayout={moonHandoff.onMenuButtonLayout} style={layers.menuButton}>
            <MenuButton onPress={openMenu} />
          </Animated.View>
        </View>
        <View style={styles.countdownGap} />
        <Animated.View style={layers.countdown}>
          <CountdownLockup daysUntilFullMoon={model.daysUntilFullMoon} boosts={model.boosts} />
        </Animated.View>

        <View style={styles.moonTopGap} />
        <Animated.View onLayout={onMoonLayout} style={[moonStage, moonHandoff.style]}>
          <MoonEmblem
            moon={model.moon}
            cycle={model.cycle}
            size={moonSize.size}
            daysUntilFullMoon={model.daysUntilFullMoon}
            boosts={model.boosts}
            progress={progress}
            dialStyle={moonHandoff.dialStyle}
          />
        </Animated.View>
        <View style={styles.moonCaptionGap} />
        <Animated.View style={layers.countdown}>
          <MoonCaption moon={model.moon} cycle={model.cycle} />
        </Animated.View>

        <View style={styles.identityGap} />
        <Animated.View style={layers.identity}>
          <IdentityBadge
            name={model.name}
            level={model.overall.level}
            arcana={model.arcana}
            onArcanaPress={arcanaSheet.show}
          />
        </Animated.View>
        <View style={styles.xpGap} />
        <Animated.View style={layers.xp}>
          <XpBar xp={model.overall.xp} fraction={model.xpFraction} toNext={model.xpToNext} />
        </Animated.View>
        <View style={styles.statsGap} />
        <Animated.View style={layers.stats}>
          <StatRow stats={model.stats} onOpen={openStat} />
        </Animated.View>
        <View style={styles.questsGap} />
        <Animated.View style={layers.quests}>
          <QuestCard summary={model.questSummary} message={model.questMessage} onPress={openTasks} />
        </Animated.View>
      </View>

      {arcanaSheet.open && (
        <ArcanaSheet arcana={model.arcana} progress={arcanaSheet.progress} onClose={arcanaSheet.hide} />
      )}
    </View>
  );
}

const gap = (height: number) => ({ flexBasis: height, flexShrink: 1 });

const styles = StyleSheet.create({
  countdownGap: gap(SECTION_GAP.countdown),
  moonTopGap: gap(SECTION_GAP.moonTop),
  moonStage: { flexShrink: 1, alignItems: 'center', justifyContent: 'center' },
  moonCaptionGap: gap(SECTION_GAP.moonCaption),
  identityGap: gap(SECTION_GAP.identity),
  xpGap: gap(SECTION_GAP.xp),
  statsGap: gap(SECTION_GAP.stats),
  questsGap: gap(SECTION_GAP.quests),
});
