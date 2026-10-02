import { useMemo } from 'react';

import { useProgress, type TodayEntry } from '@/lib/data/hooks';
import type { QuestRow, XpAwardRow } from '@/lib/db/schema';
import {
  addDays,
  canClearOn,
  entriesForDay,
  nextDays,
  parseDay,
  questBaseXp,
  recursOn,
  type DayKey,
} from '@/lib/game';
import { formatDayLabel, formatShortDate, formatWeekdays } from '@/lib/format';
import type { DateFilter, StatusFilter } from '@/lib/state/taskFilters';
import type { StatKey } from '@/lib/game';
import type { AwardPreview } from './useAwardPreview';

export interface TaskItem {
  key: string;
  quest: QuestRow;
  day: DayKey;
  done: boolean;
  award: XpAwardRow | null;
  xp: number;
  moonMult: number;
  blessed: boolean;
  clearable: boolean;
  undoable: boolean;
  meta: string;
}

export interface TaskSection {
  key: string;
  title: string | null;
  data: TaskItem[];
}

export interface TaskFilterState {
  date: DateFilter;
  status: StatusFilter;
  stats: readonly StatKey[];
}

function repeatMeta(quest: QuestRow): string {
  if (quest.repeat === 'daily') return 'DAILY';
  if (quest.repeat === 'days') return formatWeekdays(quest.repeatDays);
  return '';
}

export function useTaskList(filters: TaskFilterState, preview: AwardPreview) {
  const { today, catalog, ledger, quests: todayEntries } = useProgress();

  return useMemo(() => {
    const live = catalog.filter((q) => q.archivedAt === null);

    const toItem = (entry: TodayEntry | { quest: QuestRow; day: DayKey; done: boolean; award: XpAwardRow | null; carriedFrom: DayKey | null }, meta?: string): TaskItem => {
      const { quest, day, done, award } = entry;
      const isToday = day === today;
      const priced =
        done && award
          ? null
          : isToday
            ? preview({ questId: quest.id, stat: quest.stat, effort: quest.effort, challenge: quest.challenge })
            : { awarded: questBaseXp(quest.effort, quest.challenge), moonMult: 1, blessingPct: 0 };
      const carried = entry.carriedFrom ? `FROM ${formatShortDate(parseDay(entry.carriedFrom))}` : '';
      return {
        key: `${quest.id}:${day}`,
        quest,
        day,
        done,
        award,
        xp: award ? award.awardedXp : (priced?.awarded ?? 0),
        moonMult: award ? award.moonMult : (priced?.moonMult ?? 1),
        blessed: award ? award.blessingPct > 0 : (priced?.blessingPct ?? 0) > 0,
        clearable: !done && (isToday ? canClearOn(quest, today, ledger) : quest.repeat === 'once'),
        undoable: done && award?.day === today,
        meta: meta ?? (carried || repeatMeta(quest)),
      };
    };

    const dayItems = (day: DayKey) =>
      (day === today ? todayEntries : entriesForDay(live, ledger, day, today)).map((e) => toItem(e));

    let sections: TaskSection[];
    if (filters.date === 'today') {
      sections = [{ key: today, title: null, data: dayItems(today) }];
    } else if (filters.date === 'tomorrow') {
      const tomorrow = addDays(today, 1);
      sections = [{ key: tomorrow, title: null, data: dayItems(tomorrow) }];
    } else if (filters.date === 'week') {
      sections = nextDays(today, 7).map((day, i) => ({
        key: day,
        title: i === 0 ? 'TODAY' : i === 1 ? 'TOMORROW' : formatDayLabel(parseDay(day)),
        data: dayItems(day),
      }));
    } else {
      const onToday = new Set(todayEntries.map((e) => e.quest.id));
      const upcoming = live
        .filter((q) => q.repeat === 'once' && !onToday.has(q.id) && (q.date ?? today) > today)
        .filter((q) => !ledger.some((a) => a.questId === q.id))
        .sort((a, b) => ((a.date ?? '') < (b.date ?? '') ? -1 : 1))
        .map((q) => {
          const day = q.date ?? today;
          return toItem({ quest: q, day, done: false, award: null, carriedFrom: null }, formatShortDate(parseDay(day)));
        });
      const otherDays = live
        .filter((q) => q.repeat !== 'once' && !onToday.has(q.id))
        .map((q) => {
          let day = addDays(today, 1);
          for (let i = 1; i <= 7 && !recursOn(q, day); i += 1) day = addDays(today, i + 1);
          return toItem({ quest: q, day, done: false, award: null, carriedFrom: null });
        });
      sections = [
        { key: 'today', title: 'TODAY', data: dayItems(today) },
        { key: 'upcoming', title: 'UPCOMING', data: upcoming },
        { key: 'other', title: 'OTHER DAYS', data: otherDays },
      ];
    }

    const matches = (item: TaskItem) =>
      (filters.status === 'all' || (filters.status === 'cleared') === item.done) &&
      (filters.stats.length === 0 || filters.stats.includes(item.quest.stat));

    const filtered = sections
      .map((s) => ({ ...s, data: s.data.filter(matches) }))
      .filter((s) => s.data.length > 0);
    const total = sections.reduce((n, s) => n + s.data.length, 0);

    return { sections: filtered, total, empty: live.length === 0, items: filtered.flatMap((s) => s.data) };
  }, [today, catalog, ledger, todayEntries, filters.date, filters.status, filters.stats, preview]);
}
