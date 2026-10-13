import { memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import type { DayKey } from '@/lib/game';
import { MONTH_SHEET } from '../../config/monthSheetLayout';
import { DayCell } from './DayCell';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export const MonthGrid = memo(function MonthGrid({
  cells,
  selected,
  today,
  first,
  onPick,
}: {
  cells: readonly (DayKey | null)[];
  selected: DayKey;
  today: DayKey;
  first: DayKey;
  onPick: (day: DayKey) => void;
}) {
  const weeks = useMemo(
    () => Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7)),
    [cells],
  );
  return (
    <View>
      <View className="mb-1 flex-row" importantForAccessibility="no-hide-descendants">
        {WEEKDAYS.map((day) => (
          <Text
            key={day}
            maxFontSizeMultiplier={MONTH_SHEET.maxFontScale}
            className="flex-1 text-center font-display-medium text-2xs tracking-xs text-tertiary"
          >
            {day}
          </Text>
        ))}
      </View>
      {weeks.map((week, w) => (
        <View key={w} className="mb-2 flex-row">
          {week.map((day, d) =>
            day === null ? (
              <View key={`e${d}`} className="flex-1" />
            ) : (
              <DayCell
                key={day}
                day={day}
                selected={day === selected}
                isToday={day === today}
                disabled={day > today || day < first}
                onPick={onPick}
              />
            ),
          )}
        </View>
      ))}
    </View>
  );
});
