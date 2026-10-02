import { memo, useCallback, type ReactNode } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';

import { EDGE_TAB_HEIGHT } from '@/constants/layout';
import { usePageHeaderLayers } from '@/hooks/usePageHeaderLayers';
import type { MoonState } from '@/lib/game';
import { useHeaderMoon } from '@/lib/state/headerMoon';
import { skewX, textShade } from '@/lib/style';
import { BackTab } from '../BackTab';
import { DateTab } from '../DateTab';
import { HeaderMoon } from './HeaderMoon';

const TITLE_STYLE = [skewX(-6), textShade, { lineHeight: 40 }];

export const PageHeader = memo(function PageHeader({
  date,
  title,
  moon,
  level,
  onBack,
  progress,
  aside,
}: {
  date: Date;
  title?: string;
  moon: MoonState;
  level: number;
  onBack: () => void;
  progress: SharedValue<number>;
  aside?: ReactNode;
}) {
  const layers = usePageHeaderLayers(progress);
  const setMoonCenterX = useHeaderMoon((state) => state.setCenterX);
  const onCenterLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      setMoonCenterX(x + width / 2);
    },
    [setMoonCenterX],
  );
  return (
    <View>
      <View className="flex-row items-start" style={styles.row}>
        <Animated.View style={layers.dateTab}>
          <DateTab date={date} />
        </Animated.View>
        <View onLayout={onCenterLayout} pointerEvents="box-none" style={styles.center}>
          <HeaderMoon moon={moon} level={level} captionStyle={layers.caption} />
        </View>
        <Animated.View style={layers.back}>
          <BackTab onPress={onBack} />
        </Animated.View>
      </View>
      {title !== undefined && (
        <Animated.View style={layers.title} className="mt-7 flex-row items-end justify-between">
          <Text accessibilityRole="header" className="font-display-italic text-2xl text-white" style={TITLE_STYLE}>
            {title}
          </Text>
          {aside}
        </Animated.View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: { height: EDGE_TAB_HEIGHT, overflow: 'visible' },
  center: { flex: 1, alignItems: 'center' },
});
