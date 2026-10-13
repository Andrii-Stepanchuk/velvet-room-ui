import { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SharedValue } from 'react-native-reanimated';

import { SectionLabel } from '@/components/ui';
import { PAGE_BOTTOM, PAGE_PADDING_X } from '@/constants/layout';
import { getMoonState, isFullMoonDay, parseDay } from '@/lib/game';
import { formatJournalDay } from '@/lib/format';
import { DAY_LOG } from '../../config/dayLogLayout';
import type { JournalDay } from '../../hooks/useJournal';
import { ClearRow } from './ClearRow';
import { DaySummary } from './DaySummary';
import { DealtRow } from './DealtRow';
import { EmptyDay } from './EmptyDay';
import { MilestoneRow } from './MilestoneRow';

export const DayLog = memo(function DayLog({
  entry,
  isToday,
  deal,
}: {
  entry: JournalDay;
  isToday: boolean;
  deal: SharedValue<number>;
}) {
  const insets = useSafeAreaInsets();
  const { date, phase, fullMoon } = useMemo(() => {
    const d = parseDay(entry.day);
    return { date: d, phase: getMoonState(d).name, fullMoon: isFullMoonDay(d) };
  }, [entry.day]);
  const { events } = entry;
  const count = events.length + 2;

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={[css.content, { paddingBottom: insets.bottom + PAGE_BOTTOM + DAY_LOG.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <DealtRow deal={deal} index={0} count={count}>
          <SectionLabel label={formatJournalDay(date, isToday)} />
        </DealtRow>
        <View style={css.summary}>
          <DealtRow deal={deal} index={1} count={count}>
            <DaySummary summary={entry.summary} phase={phase} fullMoon={fullMoon} />
          </DealtRow>
        </View>
        <View style={css.list}>
          {events.length === 0 ? (
            <DealtRow deal={deal} index={2} count={count}>
              <EmptyDay isToday={isToday} />
            </DealtRow>
          ) : (
            events.map((event, i) => (
              <View key={event.key} style={i > 0 ? css.row : undefined}>
                <DealtRow deal={deal} index={i + 2} count={count}>
                  {event.kind === 'clear' ? (
                    <ClearRow award={event.award} last={i === events.length - 1} />
                  ) : (
                    <MilestoneRow milestone={event.milestone} last={i === events.length - 1} />
                  )}
                </DealtRow>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
});

const css = StyleSheet.create({
  content: { paddingHorizontal: PAGE_PADDING_X, paddingTop: DAY_LOG.top },
  summary: { marginTop: DAY_LOG.summaryGap },
  list: { marginTop: DAY_LOG.listGap },
  row: { marginTop: DAY_LOG.rowGap },
});
