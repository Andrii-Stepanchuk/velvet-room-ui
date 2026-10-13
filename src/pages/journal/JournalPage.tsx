import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PageHeader } from '@/components/ui';
import { HEADER_TOP, PAGE_PADDING_X } from '@/constants/layout';
import { useLunarDay } from '@/hooks/useLunarDay';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import { useSheet } from '@/hooks/useSheet';
import { useProgress } from '@/lib/data/hooks';
import { getMoonState, parseDay, type DayKey } from '@/lib/game';
import { spokenDate } from '@/lib/format';
import type { RootStackParamList } from '@/navigation/navigation.types';
import { DayLog } from './components/DayLog/DayLog';
import { MonthSheet } from './components/MonthSheet/MonthSheet';
import { MoonTrack } from './components/MoonTrack/MoonTrack';
import { MONTH_SHEET_TIMING } from './config/journalTiming';
import { useDaySwap } from './hooks/useDaySwap';
import { useJournal } from './hooks/useJournal';
import { useJournalLayers } from './hooks/useJournalLayers';
import { useTrackGeometry } from './hooks/useTrackGeometry';
import { useTrackScroll } from './hooks/useTrackScroll';

export function JournalPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Journal'>>();
  const { progress, leaving } = useScreenTransition();
  const { now, moon } = useLunarDay();
  const { overall } = useProgress();
  const journal = useJournal();
  const g = useTrackGeometry();
  const [selected, setSelected] = useState<DayKey>(journal.today);
  const { dayAt, indexOf } = journal;
  const selectIndex = useCallback((index: number) => setSelected(dayAt(index)), [dayAt]);
  const track = useTrackScroll(g, indexOf(selected), journal.lastIndex, selectIndex);
  const layers = useJournalLayers(progress, track.fade);
  const swap = useDaySwap(selected);
  const [sheetKey, setSheetKey] = useState(0);
  const sheet = useSheet(MONTH_SHEET_TIMING);
  const back = useCallback(() => navigation.goBack(), [navigation]);

  const firstRef = useRef(journal.first);
  const { sync } = track;
  useEffect(() => {
    if (firstRef.current === journal.first) return;
    firstRef.current = journal.first;
    sync(indexOf(selected));
  }, [journal.first, indexOf, selected, sync]);

  const focusDate = useMemo(() => parseDay(dayAt(track.anchor)), [dayAt, track.anchor]);
  const trackLabel = useMemo(() => {
    const date = parseDay(selected);
    return `Journal day, ${spokenDate(date)}${selected === journal.today ? ', today' : ''}, ${getMoonState(date).name}`;
  }, [selected, journal.today]);

  const openMonth = useCallback(() => {
    setSheetKey((k) => k + 1);
    sheet.show();
  }, [sheet]);

  const { jumpTo } = track;
  const pick = useCallback(
    (day: DayKey) => {
      sheet.hide();
      jumpTo(indexOf(day));
    },
    [sheet, jumpTo, indexOf],
  );

  const { entry: entryFor } = journal;
  const entry = useMemo(() => entryFor(swap.shown), [entryFor, swap.shown]);
  const hidden = sheet.open ? 'no-hide-descendants' : 'auto';

  return (
    <View className="flex-1" pointerEvents={leaving ? 'none' : 'auto'} style={{ paddingTop: insets.top + HEADER_TOP }}>
      <View style={styles.padded} importantForAccessibility={hidden}>
        <PageHeader date={now} title="JOURNAL" moon={moon} level={overall.level} onBack={back} progress={progress} />
      </View>
      <View importantForAccessibility={hidden}>
        <MoonTrack
          g={g}
          anchor={track.anchor}
          lastIndex={journal.lastIndex}
          selected={selected}
          focusDate={focusDate}
          today={journal.today}
          label={trackLabel}
          dayAt={dayAt}
          scroll={track.scroll}
          moving={track.moving}
          progress={progress}
          gesture={track.gesture}
          layers={layers}
          onStep={track.step}
          onOpenMonth={openMonth}
        />
      </View>
      <Animated.View style={[styles.log, layers.log]} importantForAccessibility={hidden}>
        <DayLog entry={entry} isToday={swap.shown === journal.today} deal={swap.deal} />
      </Animated.View>
      {sheet.open && (
        <MonthSheet
          key={sheetKey}
          selected={selected}
          today={journal.today}
          first={journal.first}
          progress={sheet.progress}
          onPick={pick}
          onClose={sheet.hide}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: PAGE_PADDING_X },
  log: { flex: 1 },
});
