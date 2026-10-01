import { create } from 'zustand';

export type BoostOverrideKey = 'darkHour' | 'fullMoon';

interface BoostOverrides {
  darkHour: boolean;
  fullMoon: boolean;
  toggle: (key: BoostOverrideKey) => void;
}

export const useBoostOverrides = create<BoostOverrides>((set) => ({
  darkHour: false,
  fullMoon: false,
  toggle: (key) => set((state) => (key === 'darkHour' ? { darkHour: !state.darkHour } : { fullMoon: !state.fullMoon })),
}));
