import { useCallback } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BackHint } from '@/components/ui';
import { HEADER_TOP } from '@/constants/layout';
import { useLunarDay } from '@/hooks/useLunarDay';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import { useProgress } from '@/lib/data/hooks';
import type { RootStackParamList } from '@/navigation/navigation.types';
import { MenuHeader } from './components/MenuHeader';
import { MenuList } from './components/MenuList/MenuList';
import type { MenuItem } from './config/menuItems';
import { useMenuLayers } from './hooks/useMenuLayers';
import { useMenuSelection } from './hooks/useMenuSelection';

export function MenuPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Menu'>>();
  const { progress, leaving, leave } = useScreenTransition();
  const { now, moon } = useLunarDay();
  const { overall } = useProgress();
  const layers = useMenuLayers(progress);

  const back = useCallback(() => navigation.goBack(), [navigation]);
  const confirm = useCallback(
    (item: MenuItem) => {
      if (item.target === 'Status') navigation.goBack();
      if (item.target === 'Settings') leave(() => navigation.navigate('Settings'));
    },
    [leave, navigation],
  );
  const selection = useMenuSelection(confirm);

  return (
    <View
      className="flex-1"
      pointerEvents={leaving ? 'none' : 'auto'}
      style={{ paddingTop: insets.top + HEADER_TOP, paddingBottom: insets.bottom + 16 }}
    >
      <MenuHeader date={now} level={overall.level} moon={moon} titleStyle={layers.title} moonStyle={layers.moon} />
      <View className="flex-1 justify-center">
        <MenuList
          progress={progress}
          selected={selection.selected}
          highlightY={selection.highlightY}
          shake={selection.shake}
          onPress={selection.press}
        />
      </View>
      <Animated.View style={layers.back}>
        <BackHint onPress={back} />
      </Animated.View>
    </View>
  );
}
