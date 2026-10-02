import { useCallback, useMemo, useState } from 'react';
import { Alert, SectionList, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PageHeader, SectionLabel } from '@/components/ui';
import { HEADER_TOP, PAGE_BOTTOM, PAGE_PADDING_X } from '@/constants/layout';
import { useLunarDay } from '@/hooks/useLunarDay';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import { useSheet } from '@/hooks/useSheet';
import { useProgress, useQuests } from '@/lib/data/hooks';
import type { QuestInput } from '@/lib/data/repositories';
import type { QuestRow as QuestRecord } from '@/lib/db/schema';
import { addDays, canClearOn, summarizeQuests, type DayKey } from '@/lib/game';
import { formatMultiplier } from '@/lib/format';
import { useTaskFilters } from '@/lib/state/taskFilters';
import type { RootStackParamList } from '@/navigation/navigation.types';
import { AddQuestPlate } from './components/AddQuestPlate';
import { BoostChip } from './components/BoostChip';
import { BulkBar } from './components/BulkBar/BulkBar';
import { CountLockup } from './components/CountLockup';
import { FilterRail } from './components/FilterRail/FilterRail';
import { QuestForge } from './components/QuestForge/QuestForge';
import { QuestRow } from './components/QuestRow/QuestRow';
import { RankUpBlade } from './components/RankUpBlade';
import { TasksEmpty, type EmptyKind } from './components/TasksEmpty';
import { ADD_PLATE, BULK_BAR, TASKS_GAP } from './config/tasksLayout';
import { FORGE_SHEET } from './config/tasksTiming';
import { useAwardPreview } from './hooks/useAwardPreview';
import { useClearFeedback } from './hooks/useClearFeedback';
import { useQuestSelection } from './hooks/useQuestSelection';
import { useTaskList, type TaskItem, type TaskSection } from './hooks/useTaskList';
import { useTasksLayers } from './hooks/useTasksLayers';

function boostCaption(darkHour: boolean, fullMoon: boolean, multiplier: number): string | null {
  if (!darkHour && !fullMoon) return null;
  const sky = darkHour && fullMoon ? 'FULL MOON · DARK HOUR' : fullMoon ? 'FULL MOON' : 'DARK HOUR';
  return `${formatMultiplier(multiplier)} ${sky}`;
}

export function TasksPage() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Tasks'>>();
  const { progress, leaving } = useScreenTransition();
  const { now, moon, boosts } = useLunarDay();
  const { overall, quests: todayEntries } = useProgress();
  const quests = useQuests();
  const layers = useTasksLayers(progress);
  const filters = useTaskFilters();
  const preview = useAwardPreview();
  const list = useTaskList(filters, preview);
  const selection = useQuestSelection();
  const feedback = useClearFeedback();
  const [editing, setEditing] = useState<QuestRecord | null>(null);
  const [forgeKey, setForgeKey] = useState(0);
  const clearEditing = useCallback(() => setEditing(null), []);
  const forge = useSheet(FORGE_SHEET, clearEditing);
  const summary = summarizeQuests(todayEntries);
  const liveBoost = boostCaption(boosts.darkHour, boosts.fullMoon, boosts.multiplier);
  const defaultDate: DayKey = filters.date === 'tomorrow' ? addDays(quests.today, 1) : quests.today;
  const defaults = useMemo(() => ({ stat: filters.stats[0] ?? ('knowledge' as const), date: defaultDate }), [filters.stats, defaultDate]);

  const back = useCallback(() => navigation.goBack(), [navigation]);

  const openForge = useCallback(
    (quest: QuestRecord | null) => {
      setEditing(quest);
      setForgeKey((k) => k + 1);
      forge.show();
    },
    [forge],
  );

  const onCheck = useCallback(
    (item: TaskItem) => {
      if (item.undoable) {
        const removed = quests.undo(item.quest.id);
        if (removed) feedback.undone(removed);
        return;
      }
      if (item.clearable) feedback.cleared(quests.clear([item.quest.id]));
    },
    [quests, feedback],
  );

  const onOpen = useCallback((item: TaskItem) => openForge(item.quest), [openForge]);

  const save = useCallback(
    (input: QuestInput) => {
      if (editing) quests.update(editing.id, input);
      else quests.create(input);
      forge.hide();
    },
    [editing, quests, forge],
  );

  const removeEditing = useCallback(() => {
    if (editing) quests.archive([editing.id]);
    forge.hide();
  }, [editing, quests, forge]);

  const selected = useMemo(() => quests.quests.filter((q) => selection.ids.has(q.id)), [quests.quests, selection.ids]);
  const clearableSelected = selected.filter((q) => canClearOn(q, quests.today, quests.ledger));
  const movableSelected = selected.filter((q) => q.repeat === 'once' && !quests.ledger.some((a) => a.questId === q.id));

  const bulkClear = useCallback(() => {
    const order = list.items.map((i) => i.quest.id).filter((id) => clearableSelected.some((q) => q.id === id));
    feedback.cleared(quests.clear(order));
    selection.cancel();
  }, [list.items, clearableSelected, quests, feedback, selection]);

  const bulkMove = useCallback(
    (day: DayKey) => {
      quests.move(
        movableSelected.map((q) => q.id),
        day,
      );
      selection.cancel();
    },
    [movableSelected, quests, selection],
  );

  const bulkDelete = useCallback(() => {
    const ids = selected.map((q) => q.id);
    Alert.alert(
      `Delete ${ids.length} ${ids.length === 1 ? 'quest' : 'quests'}?`,
      'They leave your list from today. XP they already earned stays in your History.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            quests.archive(ids);
            selection.cancel();
          },
        },
      ],
    );
  }, [selected, quests, selection]);

  const emptyKind: EmptyKind = list.empty ? 'fresh' : list.total > 0 ? 'filtered' : 'quiet';

  const renderItem = useCallback(
    ({ item }: { item: TaskItem }) => (
      <View style={styles.row}>
        <QuestRow
          item={item}
          selecting={selection.active}
          selected={selection.ids.has(item.quest.id)}
          readout={feedback.readouts.get(item.quest.id)}
          onCheck={onCheck}
          onOpen={onOpen}
          onSelect={selection.toggle}
          onStartSelect={selection.start}
          onReadoutDone={feedback.dismissReadout}
        />
      </View>
    ),
    [selection, feedback, onCheck, onOpen],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: TaskSection }) =>
      section.title ? <SectionLabel label={section.title} className="mb-3 mt-5" /> : null,
    [],
  );

  const bulkHint = selection.ids.size > 0 && (movableSelected.length === 0 || clearableSelected.length === 0);
  const pinnedHeight = selection.active ? BULK_BAR.height + (bulkHint ? BULK_BAR.hintHeight : 0) : ADD_PLATE.height;

  return (
    <View
      className="flex-1"
      pointerEvents={leaving ? 'none' : 'auto'}
      style={{ paddingTop: insets.top + HEADER_TOP }}
    >
      <View
        style={styles.padded}
        importantForAccessibility={forge.open ? 'no-hide-descendants' : 'auto'}
      >
        <PageHeader
          date={now}
          title="TASKS"
          moon={moon}
          level={overall.level}
          onBack={back}
          progress={progress}
          aside={<CountLockup done={summary.done} total={summary.total} />}
        />
      </View>
      {liveBoost && (
        <Animated.View style={[styles.padded, styles.boost, layers.rail]}>
          <BoostChip label={liveBoost} />
        </Animated.View>
      )}
      <Animated.View
        style={[styles.padded, styles.rail, layers.rail]}
        importantForAccessibility={forge.open ? 'no-hide-descendants' : 'auto'}
      >
        <FilterRail
          date={filters.date}
          status={filters.status}
          stats={filters.stats}
          onDate={filters.setDate}
          onStatus={filters.setStatus}
          onStat={filters.toggleStat}
        />
      </Animated.View>
      <Animated.View
        style={[styles.list, { marginBottom: pinnedHeight + insets.bottom + PAGE_BOTTOM + TASKS_GAP.pinned }, layers.list]}
        importantForAccessibility={forge.open ? 'no-hide-descendants' : 'auto'}
      >
        <SectionList
          sections={list.sections}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={<TasksEmpty kind={emptyKind} onReset={filters.reset} />}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </Animated.View>
      <Animated.View
        style={[styles.pinned, { bottom: insets.bottom + PAGE_BOTTOM }, layers.pinned]}
        importantForAccessibility={forge.open ? 'no-hide-descendants' : 'auto'}
      >
        {selection.active ? (
          <BulkBar
            count={selection.ids.size}
            clearable={clearableSelected.length}
            movable={movableSelected.length}
            today={quests.today}
            onClear={bulkClear}
            onMove={bulkMove}
            onDelete={bulkDelete}
            onCancel={selection.cancel}
          />
        ) : (
          <AddQuestPlate onPress={() => openForge(null)} />
        )}
      </Animated.View>
      {feedback.rankUp && <RankUpBlade key={feedback.rankUp.id} rankUp={feedback.rankUp} onDone={feedback.dismissRankUp} />}
      {forge.open && (
        <QuestForge
          key={forgeKey}
          quest={editing}
          defaults={defaults}
          preview={preview}
          today={quests.today}
          progress={forge.progress}
          onClose={forge.hide}
          onSubmit={save}
          onDelete={removeEditing}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: PAGE_PADDING_X },
  rail: { marginTop: TASKS_GAP.rail },
  boost: { marginTop: TASKS_GAP.boost, alignItems: 'flex-end' },
  list: { flex: 1, marginTop: TASKS_GAP.list },
  content: { paddingHorizontal: PAGE_PADDING_X, paddingBottom: TASKS_GAP.pinned },
  row: { marginBottom: TASKS_GAP.row },
  pinned: { position: 'absolute', left: PAGE_PADDING_X, right: PAGE_PADDING_X },
});
