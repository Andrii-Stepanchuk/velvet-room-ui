import { memo, useCallback } from 'react';
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionPlate, BackTab, SheetSurface, SkewButton } from '@/components/ui';
import { CHALLENGES, EFFORTS, STAT_DEFS, type DayKey, type Repeat } from '@/lib/game';
import { textShade } from '@/lib/style';
import { FORGE } from '../../config/tasksLayout';
import type { QuestInput } from '@/lib/data/repositories';
import type { QuestRow } from '@/lib/db/schema';
import type { StatKey } from '@/lib/game';
import type { AwardPreview } from '../../hooks/useAwardPreview';
import { useQuestForm } from '../../hooks/useQuestForm';
import { useForgeSheetStyles } from '../../hooks/useForgeSheetStyles';
import { DateStrip } from '../DateStrip';
import { SegmentBlade, type Segment } from '../SegmentBlade';
import { ForgeField } from './ForgeField';
import { ForgePrice } from './ForgePrice';
import { NoteInput } from './NoteInput';
import { ScalePicker, type ScaleOption } from './ScalePicker';
import { StatPicker } from './StatPicker';
import { TitleInput } from './TitleInput';
import { WeekdayPicker } from './WeekdayPicker';

const REPEATS: readonly Segment<Repeat>[] = [
  { key: 'once', label: 'ONCE' },
  { key: 'daily', label: 'DAILY' },
  { key: 'days', label: 'DAYS', accessibilityLabel: 'Chosen weekdays' },
];

const EFFORT_OPTIONS: readonly ScaleOption<(typeof EFFORTS)[number]['key']>[] = EFFORTS.map((e) => ({
  key: e.key,
  label: e.label,
  detail: e.hint,
}));

const CHALLENGE_OPTIONS: readonly ScaleOption<(typeof CHALLENGES)[number]['key']>[] = CHALLENGES.map((c) => ({
  key: c.key,
  label: c.label,
  detail: c.meaning,
}));

const EFFORT_HINT: Record<string, string> = {
  quick: 'Up to 15 minutes.',
  short: 'About half an hour.',
  session: 'About an hour.',
  deep: 'About two hours of real focus.',
  epic: 'Half a day or more.',
};

export const QuestForge = memo(function QuestForge({
  quest,
  defaults,
  preview,
  today,
  progress,
  onClose,
  onSubmit,
  onDelete,
}: {
  quest: QuestRow | null;
  defaults: { stat: StatKey; date: DayKey };
  preview: AwardPreview;
  today: DayKey;
  progress: SharedValue<number>;
  onClose: () => void;
  onSubmit: (input: QuestInput) => void;
  onDelete: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { width, height, rise, keyboardOffset, backdrop, sheet } = useForgeSheetStyles(progress);
  const { draft, set, valid, base, live, editing } = useQuestForm(quest, defaults, preview);
  const submit = useCallback(() => {
    if (valid) onSubmit({ ...draft, note: draft.note ?? null });
  }, [valid, draft, onSubmit]);

  const confirmDelete = useCallback(() => {
    Alert.alert('Delete quest?', 'It leaves your list from today. XP it already earned stays in your History.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  }, [onDelete]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, backdrop]}>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close the Quest Forge" className="flex-1 bg-background-900/80" />
      </Animated.View>
      <Animated.View style={[styles.sheet, { height: height + FORGE.lift }, sheet]}>
        <SheetSurface width={width} height={height + rise} rise={rise} top={FORGE.lift - rise} gradientId="forgeField" />
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={keyboardOffset - insets.bottom}
          style={[styles.body, { marginTop: FORGE.lift + rise }]}
        >
          <View className="flex-row items-center justify-between" style={styles.padded}>
            <Text
              accessibilityRole="header"
              maxFontSizeMultiplier={FORGE.maxFontScale}
              className="font-display-italic text-xl text-white"
              style={textShade}
            >
              {editing ? 'EDIT QUEST' : 'FORGE A QUEST'}
            </Text>
            <BackTab onPress={onClose} />
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ForgeField label="QUEST">
              <TitleInput value={draft.title} onChangeText={(v) => set('title', v)} autoFocus={!editing} />
            </ForgeField>
            <ForgeField label="LIFE STAT" hint={STAT_DEFS[draft.stat].description}>
              <StatPicker value={draft.stat} onChange={(v) => set('stat', v)} />
            </ForgeField>
            <ForgeField label="EFFORT" hint={EFFORT_HINT[draft.effort]}>
              <ScalePicker options={EFFORT_OPTIONS} value={draft.effort} onChange={(v) => set('effort', v)} label="Effort" />
            </ForgeField>
            <ForgeField label="CHALLENGE" hint={CHALLENGES.find((c) => c.key === draft.challenge)?.meaning}>
              <ScalePicker options={CHALLENGE_OPTIONS} value={draft.challenge} onChange={(v) => set('challenge', v)} label="Challenge" />
            </ForgeField>
            <ForgeField label="REPEAT">
              <SegmentBlade segments={REPEATS} value={draft.repeat} onChange={(v) => set('repeat', v)} label="Repeat" />
              <View className="mt-3">
                {draft.repeat === 'once' && (
                  <DateStrip today={today} selected={draft.date} onSelect={(day) => set('date', day)} />
                )}
                {draft.repeat === 'days' && (
                  <WeekdayPicker mask={draft.repeatDays} onChange={(mask) => set('repeatDays', mask)} />
                )}
                {draft.repeat === 'daily' && (
                  <Text className="font-body-medium text-sm text-secondary">On your list every day.</Text>
                )}
              </View>
            </ForgeField>
            <ForgeField label="NOTE · OPTIONAL">
              <NoteInput value={draft.note ?? ''} onChangeText={(v) => set('note', v)} />
            </ForgeField>
            {editing && (
              <View style={styles.danger}>
                <ActionPlate label="DELETE QUEST" danger onPress={confirmDelete} accessibilityHint="Asks for confirmation" />
              </View>
            )}
          </ScrollView>
          <View className="h-px bg-accent/15" />
          <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
            <ForgePrice stat={draft.stat} effort={draft.effort} challenge={draft.challenge} base={base} live={live} />
            <View className="mt-3">
              <SkewButton label={editing ? 'SAVE CHANGES ▸' : 'SEAL THE QUEST ▸'} onPress={submit} disabled={!valid} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  body: { flex: 1 },
  padded: { paddingHorizontal: FORGE.padX },
  scroll: { flex: 1 },
  content: { paddingHorizontal: FORGE.padX, paddingBottom: 24 },
  danger: { marginTop: 36 },
  footer: { paddingHorizontal: FORGE.padX, paddingTop: FORGE.footerTop },
});
