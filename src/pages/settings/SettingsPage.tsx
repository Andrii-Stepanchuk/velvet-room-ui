import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PageHeader } from '@/components/ui';
import { HEADER_TOP, PAGE_BOTTOM, PAGE_PADDING_X } from '@/constants/layout';
import { useLunarDay } from '@/hooks/useLunarDay';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import { useProgress } from '@/lib/data/hooks';
import type { RootStackParamList } from '@/navigation/navigation.types';
import { AccountSection } from './components/AccountSection';
import { BoostsSection } from './components/BoostsSection/BoostsSection';
import { EntranceSection } from './components/EntranceSection';
import { PlayerSection } from './components/PlayerSection/PlayerSection';
import { TestingSection } from './components/TestingSection';
import { SETTINGS_GAP } from './config/settingsLayout';
import { useBoostRows } from './hooks/useBoostRows';
import { useDeleteAccount } from './hooks/useDeleteAccount';
import { useEntranceReplay } from './hooks/useEntranceReplay';
import { useRename } from './hooks/useRename';
import { useSettingsLayers } from './hooks/useSettingsLayers';
import { useTestingRows } from './hooks/useTestingRows';

export function SettingsPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Settings'>>();
  const { progress, leaving, leave } = useScreenTransition();
  const { now, moon, nextFullMoon, daysUntilFullMoon, boosts } = useLunarDay();
  const { overall } = useProgress();
  const layers = useSettingsLayers(progress);
  const rename = useRename();
  const deleteAccount = useDeleteAccount(leave);
  const replayEntrance = useEntranceReplay(leave);
  const boostRows = useBoostRows(nextFullMoon, daysUntilFullMoon, boosts);
  const testing = useTestingRows();
  const back = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View
      className="flex-1"
      pointerEvents={leaving ? 'none' : 'auto'}
      style={{ paddingTop: insets.top + HEADER_TOP, paddingBottom: insets.bottom + PAGE_BOTTOM }}
    >
      <View style={styles.padded}>
        <PageHeader date={now} title="SETTINGS" moon={moon} level={overall.level} onBack={back} progress={progress} />
      </View>
      <ScrollView className="flex-1" contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View style={layers.player}>
          <PlayerSection
            value={rename.value}
            onChangeText={rename.setValue}
            canSave={rename.canSave}
            empty={rename.empty}
            onSave={rename.save}
          />
        </Animated.View>
        <Animated.View style={[styles.section, layers.boosts]}>
          <BoostsSection rows={boostRows} />
        </Animated.View>
        <Animated.View style={[styles.section, layers.rest]}>
          <EntranceSection onReplay={replayEntrance} />
          {__DEV__ && (
            <View style={styles.section}>
              <TestingSection rows={testing.rows} onToggle={testing.toggle} onSeedQuests={testing.seedQuests} />
            </View>
          )}
          <View style={styles.danger}>
            <AccountSection onDelete={deleteAccount} />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: PAGE_PADDING_X },
  content: { paddingHorizontal: PAGE_PADDING_X, paddingTop: SETTINGS_GAP.top, paddingBottom: SETTINGS_GAP.bottom },
  section: { marginTop: SETTINGS_GAP.section },
  danger: { marginTop: SETTINGS_GAP.danger },
});
