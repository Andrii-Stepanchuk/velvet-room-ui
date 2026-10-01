import { create } from 'zustand';

interface HeaderMoon {
  centerX: number | null;
  setCenterX: (centerX: number) => void;
}

export const useHeaderMoon = create<HeaderMoon>((set) => ({
  centerX: null,
  setCenterX: (centerX) => set((state) => (state.centerX === centerX ? state : { centerX })),
}));
