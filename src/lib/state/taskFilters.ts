import { create } from 'zustand';

import type { StatKey } from '@/lib/game';

export type DateFilter = 'today' | 'tomorrow' | 'week' | 'all';
export type StatusFilter = 'all' | 'open' | 'cleared';

interface TaskFilters {
  date: DateFilter;
  status: StatusFilter;
  stats: readonly StatKey[];
  setDate: (date: DateFilter) => void;
  setStatus: (status: StatusFilter) => void;
  toggleStat: (stat: StatKey) => void;
  reset: () => void;
}

export const useTaskFilters = create<TaskFilters>((set) => ({
  date: 'today',
  status: 'all',
  stats: [],
  setDate: (date) => set({ date }),
  setStatus: (status) => set({ status }),
  toggleStat: (stat) =>
    set((state) => ({
      stats: state.stats.includes(stat) ? state.stats.filter((s) => s !== stat) : [...state.stats, stat],
    })),
  reset: () => set({ status: 'all', stats: [] }),
}));
