import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackTab, SheetSurface } from '@/components/ui';
import type { DayKey } from '@/lib/game';
import { formatMonthName } from '@/lib/format';
import { textShade } from '@/lib/style';
import { MONTH_SHEET } from '../../config/monthSheetLayout';
import { useMonthSheetStyles } from '../../hooks/useMonthSheetStyles';
import { useMonthView } from '../../hooks/useMonthView';
import { MonthGrid } from './MonthGrid';
import { MonthStep } from './MonthStep';

export const MonthSheet = memo(function MonthSheet({
  selected,
  today,
  first,
  progress,
  onPick,
  onClose,
}: {
  selected: DayKey;
  today: DayKey;
  first: DayKey;
  progress: SharedValue<number>;
  onPick: (day: DayKey) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { width, height, rise, backdrop, sheet } = useMonthSheetStyles(progress);
  const view = useMonthView(selected, first, today);
  const title = `${formatMonthName(view.date)} ${view.date.getFullYear()}`;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, backdrop]}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close the month calendar"
          className="flex-1 bg-background-900/80"
        />
      </Animated.View>
      <Animated.View style={[css.sheet, { height: height + MONTH_SHEET.lift }, sheet]}>
        <SheetSurface width={width} height={height + rise} rise={rise} top={MONTH_SHEET.lift - rise} gradientId="monthField" />
        <View style={[css.body, { marginTop: MONTH_SHEET.lift + rise }]}>
          <View className="flex-row items-center justify-between">
            <Text
              accessibilityRole="header"
              maxFontSizeMultiplier={MONTH_SHEET.maxFontScale}
              numberOfLines={1}
              adjustsFontSizeToFit
              className="mr-3 flex-1 font-display-italic text-xl text-white"
              style={textShade}
            >
              {title}
            </Text>
            <View className="flex-row gap-2">
              <MonthStep direction={-1} disabled={!view.canPrev} onPress={view.prev} />
              <MonthStep direction={1} disabled={!view.canNext} onPress={view.next} />
            </View>
          </View>
          <View className="mt-5">
            <MonthGrid
              cells={view.cells}
              selected={selected}
              today={today}
              first={first}
              onPick={onPick}
            />
          </View>
        </View>
        <View style={[css.back, { bottom: insets.bottom + MONTH_SHEET.backBottom }]}>
          <BackTab onPress={onClose} />
        </View>
      </Animated.View>
    </View>
  );
});

const css = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  body: { flex: 1, paddingHorizontal: MONTH_SHEET.padX },
  back: { position: 'absolute', right: MONTH_SHEET.padX },
});
