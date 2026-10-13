import { useCallback, useMemo, useState } from 'react';

import { monthGrid, parseDay, type DayKey } from '@/lib/game';

function monthOf(day: DayKey): number {
  const date = parseDay(day);
  return date.getFullYear() * 12 + date.getMonth();
}

export function useMonthView(selected: DayKey, first: DayKey, today: DayKey) {
  const [month, setMonth] = useState(() => monthOf(selected));
  const min = monthOf(first);
  const max = monthOf(today);
  const year = Math.floor(month / 12);
  const index = month % 12;
  const cells = useMemo(() => monthGrid(year, index), [year, index]);
  const prev = useCallback(() => setMonth((m) => Math.max(m - 1, min)), [min]);
  const next = useCallback(() => setMonth((m) => Math.min(m + 1, max)), [max]);
  return { date: new Date(year, index, 1), cells, prev, next, canPrev: month > min, canNext: month < max };
}
