import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BackHint, PageHeader } from '@/components/ui';
import { HEADER_TOP, PAGE_BOTTOM, PAGE_PADDING_X } from '@/constants/layout';
import { useLunarDay } from '@/hooks/useLunarDay';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import type { RootStackParamList } from '@/navigation/navigation.types';
import { BoostsSection } from './components/BoostsSection';
import { EntranceSection } from './components/EntranceSection';
import { ProfileSection } from './components/ProfileSection';
import { useBoostRows } from './hooks/useBoostRows';
import { useDeleteAccount } from './hooks/useDeleteAccount';
import { useEntranceReplay } from './hooks/useEntranceReplay';
import { useRename } from './hooks/useRename';
import { useSettingsLayers } from './hooks/useSettingsLayers';

export function SettingsPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Settings'>>();
  const { progress, leaving, leave } = useScreenTransition();
  const { now, nextFullMoon, daysUntilFullMoon } = useLunarDay();
  const layers = useSettingsLayers(progress);
  const rename = useRename();
  const deleteAccount = useDeleteAccount(leave);
  const replayEntrance = useEntranceReplay(leave);
  const boostRows = useBoostRows(nextFullMoon, daysUntilFullMoon);
  const back = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View
      className="flex-1"
      pointerEvents={leaving ? 'none' : 'auto'}
      style={{ paddingTop: insets.top + HEADER_TOP, paddingBottom: insets.bottom + PAGE_BOTTOM }}
    >
      <Animated.View style={[styles.padded, layers.header]}>
        <PageHeader date={now} title="SETTINGS" />
      </Animated.View>
      <ScrollView className="flex-1" contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View style={layers.profile}>
          <ProfileSection
            value={rename.value}
            onChangeText={rename.setValue}
            canSave={rename.canSave}
            onSave={rename.save}
            onDelete={deleteAccount}
          />
        </Animated.View>
        <Animated.View style={[styles.section, layers.boosts]}>
          <BoostsSection rows={boostRows} />
        </Animated.View>
        <Animated.View style={[styles.section, layers.entrance]}>
          <EntranceSection onReplay={replayEntrance} />
        </Animated.View>
      </ScrollView>
      <Animated.View style={layers.back}>
        <BackHint onPress={back} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: PAGE_PADDING_X },
  content: { paddingHorizontal: PAGE_PADDING_X, paddingTop: 28, paddingBottom: 24 },
  section: { marginTop: 32 },
});
