import { memo, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { PAGE_PADDING_X } from '@/constants/layout';
import { addDays, nextDays, parseDay, type DayKey } from '@/lib/game';
import { formatShortDate } from '@/lib/format';
import { DATE_STRIP, FILTER_CHIP } from '../config/tasksLayout';
import { FilterChip } from './FilterChip';

const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

function dayLabel(day: DayKey, today: DayKey): string {
  if (day === today) return 'TODAY';
  if (day === addDays(today, 1)) return 'TOMORROW';
  return `${WEEKDAY[parseDay(day).getDay()]} ${parseDay(day).getDate()}`;
}

export const DateStrip = memo(function DateStrip({
  today,
  selected,
  onSelect,
  bleed = PAGE_PADDING_X,
}: {
  today: DayKey;
  selected: DayKey | null;
  onSelect: (day: DayKey) => void;
  bleed?: number;
}) {
  const days = useMemo(() => nextDays(today, DATE_STRIP.days), [today]);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.strip, { marginRight: -bleed }]}
      contentContainerStyle={[styles.content, { paddingRight: bleed }]}
      keyboardShouldPersistTaps="handled"
    >
      {days.map((day) => (
        <FilterChip
          key={day}
          label={dayLabel(day, today)}
          active={day === selected}
          onPress={() => onSelect(day)}
          accessibilityLabel={formatShortDate(parseDay(day))}
        />
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  strip: { flexGrow: 0 },
  content: { gap: FILTER_CHIP.gap, paddingVertical: 2 },
});
