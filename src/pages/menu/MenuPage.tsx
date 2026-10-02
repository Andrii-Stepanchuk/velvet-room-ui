import { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PageHeader } from '@/components/ui';
import { HEADER_TOP, PAGE_BOTTOM, PAGE_PADDING_X } from '@/constants/layout';
import { useLunarDay } from '@/hooks/useLunarDay';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import { useProgress } from '@/lib/data/hooks';
import type { RootStackParamList } from '@/navigation/navigation.types';
import { MenuList } from './components/MenuList/MenuList';
import type { MenuItem } from './config/menuItems';
import { useMenuSelection } from './hooks/useMenuSelection';

export function MenuPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Menu'>>();
  const { progress, leaving, leave } = useScreenTransition();
  const { now, moon } = useLunarDay();
  const { overall } = useProgress();

  const back = useCallback(() => navigation.goBack(), [navigation]);
  const confirm = useCallback(
    (item: MenuItem) => {
      if (item.target === 'Status') navigation.goBack();
      if (item.target === 'Tasks') leave(() => navigation.navigate('Tasks'));
      if (item.target === 'Stats') leave(() => navigation.navigate('Stats'));
      if (item.target === 'Settings') leave(() => navigation.navigate('Settings'));
    },
    [leave, navigation],
  );
  const selection = useMenuSelection(confirm);

  return (
    <View
      className="flex-1"
      pointerEvents={leaving ? 'none' : 'auto'}
      style={{ paddingTop: insets.top + HEADER_TOP, paddingBottom: insets.bottom + PAGE_BOTTOM }}
    >
      <View style={{ paddingHorizontal: PAGE_PADDING_X }}>
        <PageHeader date={now} title="MENU" moon={moon} level={overall.level} onBack={back} progress={progress} />
      </View>
      <View className="flex-1 justify-center">
        <MenuList
          progress={progress}
          selected={selection.selected}
          highlightY={selection.highlightY}
          shake={selection.shake}
          onPress={selection.press}
        />
      </View>
    </View>
  );
}
