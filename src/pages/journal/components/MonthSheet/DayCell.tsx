import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MoonDisc, SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { getMoonState, isFullMoonDay, parseDay, type DayKey } from '@/lib/game';
import { spokenDate } from '@/lib/format';
import { withAlpha } from '@/lib/style';
import { MONTH_SHEET } from '../../config/monthSheetLayout';

const SELECTED_FILL = withAlpha(colors.background[400], 0.9);
const SELECTED_STROKE = withAlpha(colors.accent, 0.6);
const PRESSED_FILL = withAlpha(colors.background[700], 0.6);
const RIM = withAlpha(colors.textPrimary, 0.28);

export const DayCell = memo(function DayCell({
  day,
  selected,
  isToday,
  disabled,
  onPick,
}: {
  day: DayKey;
  selected: boolean;
  isToday: boolean;
  disabled: boolean;
  onPick: (day: DayKey) => void;
}) {
  const { date, moon, full } = useMemo(() => {
    const d = parseDay(day);
    return { date: d, moon: getMoonState(d), full: isFullMoonDay(d) };
  }, [day]);
  const label = [spokenDate(date), full ? 'Full Moon' : moon.name, isToday ? 'today' : null]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={() => onPick(day)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      style={[css.cell, disabled && css.disabled]}
    >
      {({ pressed }) => (
        <>
          {(selected || pressed) && (
            <SkewPanel
              slant={MONTH_SHEET.stepSlant}
              fill={selected ? SELECTED_FILL : PRESSED_FILL}
              stroke={selected ? SELECTED_STROKE : undefined}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={css.moon}>
            {isToday && <View style={css.ring} />}
            <MoonDisc size={MONTH_SHEET.moon} illumination={moon.illumination} waxing={moon.waxing} />
            <View style={css.rim} />
            {full && <View style={css.marker} />}
          </View>
          <Text
            maxFontSizeMultiplier={MONTH_SHEET.maxFontScale}
            className={`font-display text-xs ${selected ? 'text-white' : 'text-secondary'}`}
          >
            {date.getDate()}
          </Text>
        </>
      )}
    </Pressable>
  );
});

const css = StyleSheet.create({
  cell: { flex: 1, height: MONTH_SHEET.cellHeight, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.35 },
  moon: { width: MONTH_SHEET.ring, height: MONTH_SHEET.ring, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: MONTH_SHEET.ring,
    height: MONTH_SHEET.ring,
    borderRadius: MONTH_SHEET.ring / 2,
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
  },
  rim: {
    position: 'absolute',
    width: MONTH_SHEET.moon,
    height: MONTH_SHEET.moon,
    borderRadius: MONTH_SHEET.moon / 2,
    borderWidth: 1,
    borderColor: RIM,
  },
  marker: {
    position: 'absolute',
    top: (MONTH_SHEET.ring - MONTH_SHEET.moon) / 2 - MONTH_SHEET.marker / 2,
    width: MONTH_SHEET.marker,
    height: MONTH_SHEET.marker,
    backgroundColor: colors.accent,
    transform: [{ rotate: '45deg' }],
  },
});
