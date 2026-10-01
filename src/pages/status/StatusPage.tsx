import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DateTab } from '@/components/ui';
import { HEADER_TOP, PAGE_BOTTOM, PAGE_PADDING_X } from '@/constants/layout';
import { useScreenTransition } from '@/hooks/useScreenTransition';
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
        <Animated.View style={[styles.countdown, layers.countdown]}>
          <CountdownLockup daysUntilFullMoon={model.daysUntilFullMoon} boosts={model.boosts} />
        </Animated.View>

        <Animated.View onLayout={moonHandoff.onLayout} style={[styles.moon, moonHandoff.style]}>
          <MoonEmblem
            moon={model.moon}
            cycle={model.cycle}
            size={moonSize}
            daysUntilFullMoon={model.daysUntilFullMoon}
            boosts={model.boosts}
            progress={progress}
            dialStyle={moonHandoff.dialStyle}
          />
        </Animated.View>
        <Animated.View style={[styles.moonCaption, layers.countdown]}>
          <MoonCaption moon={model.moon} cycle={model.cycle} />
        </Animated.View>

        <Animated.View style={[styles.identity, layers.identity]}>
          <IdentityBadge
            name={model.name}
            level={model.overall.level}
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
      </View>

      {arcanaSheet.open && (
        <ArcanaSheet arcana={model.arcana} progress={arcanaSheet.progress} onClose={arcanaSheet.hide} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  countdown: { marginTop: SECTION_GAP.countdown },
  moon: { alignSelf: 'center', marginTop: SECTION_GAP.moonTop },
  moonCaption: { marginTop: SECTION_GAP.moonCaption },
  identity: { marginTop: SECTION_GAP.identity },
  xp: { marginTop: SECTION_GAP.xp },
  stats: { marginTop: SECTION_GAP.stats },
  quests: { marginTop: SECTION_GAP.quests },
});
