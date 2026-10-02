import { useCallback, useMemo, useState } from 'react';

import { CONFIG } from '@/constants/config';
import type { QuestInput } from '@/lib/data/repositories';
import type { QuestRow } from '@/lib/db/schema';
import { ALL_DAYS_MASK, questBaseXp, weekdayOf, type DayKey, type StatKey } from '@/lib/game';
import type { AwardPreview } from './useAwardPreview';

export interface QuestDraft extends QuestInput {
  date: DayKey | null;
}

function draftFrom(quest: QuestRow | null, stat: StatKey, date: DayKey): QuestDraft {
  if (quest) {
    return {
      title: quest.title,
      stat: quest.stat,
      effort: quest.effort,
      challenge: quest.challenge,
      repeat: quest.repeat,
      repeatDays: quest.repeat === 'days' ? quest.repeatDays : 1 << weekdayOf(date),
      date: quest.date ?? date,
      note: quest.note ?? '',
    };
  }
  return {
    title: '',
    stat,
    effort: 'short',
    challenge: 'routine',
    repeat: 'once',
    repeatDays: 1 << weekdayOf(date),
    date,
    note: '',
  };
}

export function useQuestForm(
  quest: QuestRow | null,
  defaults: { stat: StatKey; date: DayKey },
  preview: AwardPreview,
) {
  const [draft, setDraft] = useState<QuestDraft>(() => draftFrom(quest, defaults.stat, defaults.date));

  const set = useCallback(<K extends keyof QuestDraft>(key: K, value: QuestDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  }, []);

  const valid =
    draft.title.trim().length > 0 &&
    draft.title.trim().length <= CONFIG.quests.titleMaxLength &&
    (draft.repeat !== 'days' || (draft.repeatDays & ALL_DAYS_MASK) !== 0) &&
    (draft.repeat !== 'once' || draft.date !== null);

  const base = questBaseXp(draft.effort, draft.challenge);
  const live = useMemo(
    () => preview({ questId: quest?.id ?? -1, stat: draft.stat, effort: draft.effort, challenge: draft.challenge }),
    [preview, quest?.id, draft.stat, draft.effort, draft.challenge],
  );

  return { draft, set, valid, base, live, editing: quest !== null };
}
