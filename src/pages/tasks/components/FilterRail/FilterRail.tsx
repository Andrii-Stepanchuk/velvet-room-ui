import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { STAT_KEYS, type StatKey } from '@/lib/game';
import type { DateFilter, StatusFilter } from '@/lib/state/taskFilters';
import { STAT_CHIP, TASKS_GAP } from '../../config/tasksLayout';
import { SegmentBlade, type Segment } from '../SegmentBlade';
import { StatChip } from './StatChip';

const DATES: readonly Segment<DateFilter>[] = [
  { key: 'today', label: 'TODAY' },
  { key: 'tomorrow', label: 'TOMORROW' },
  { key: 'week', label: 'WEEK', accessibilityLabel: 'Next seven days' },
  { key: 'all', label: 'ALL', accessibilityLabel: 'All quests' },
];

const STATUSES: readonly Segment<StatusFilter>[] = [
  { key: 'all', label: 'ANY STATUS', accessibilityLabel: 'Open and cleared' },
  { key: 'open', label: 'OPEN' },
  { key: 'cleared', label: 'CLEARED' },
];

export const FilterRail = memo(function FilterRail({
  date,
  status,
  stats,
  onDate,
  onStatus,
  onStat,
}: {
  date: DateFilter;
  status: StatusFilter;
  stats: readonly StatKey[];
  onDate: (date: DateFilter) => void;
  onStatus: (status: StatusFilter) => void;
  onStat: (stat: StatKey) => void;
}) {
  return (
    <View>
      <SegmentBlade segments={DATES} value={date} onChange={onDate} label="Date" />
      <View style={styles.row}>
        <SegmentBlade segments={STATUSES} value={status} onChange={onStatus} label="Status" compact />
      </View>
      <View style={[styles.row, styles.stats]} accessibilityLabel="Life stats">
        {STAT_KEYS.map((key) => (
          <StatChip key={key} stat={key} active={stats.includes(key)} onPress={onStat} />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { marginTop: TASKS_GAP.railRow },
  stats: { flexDirection: 'row', gap: STAT_CHIP.gap },
});
