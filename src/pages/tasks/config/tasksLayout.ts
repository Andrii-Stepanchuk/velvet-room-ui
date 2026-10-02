import { PAGE_PADDING_X } from '@/constants/layout';
import { slantOffset } from '@/lib/style';

export const TASKS_GAP = { rail: 20, boost: 10, railRow: 8, list: 16, row: 10, section: 22, pinned: 12 } as const;

export const DATE_BLADE = { height: 44, compactHeight: 40, slant: 12, hitSlop: 4, maxFontScale: 1.15 } as const;

export const FILTER_CHIP = { height: 36, slant: 12, gap: 8, maxFontScale: 1.15 } as const;

export const STAT_CHIP = { height: 38, slant: 12, gap: 6, icon: 15, maxFontScale: 1.15 } as const;

export const QUEST_ROW = {
  slant: 6,
  minHeight: 76,
  padY: 14,
  check: 36,
  checkSlant: 12,
  checkIcon: 20,
  gap: 14,
  maxFontScale: 1.3,
} as const;

export const QUEST_ROW_PAD = { left: slantOffset(QUEST_ROW.minHeight, QUEST_ROW.slant) + 6, right: 18 } as const;

export const ADD_PLATE = { height: 52, slant: 12, icon: 16 } as const;

export const BULK_BAR = { slant: 6, padX: 22, padY: 14, actionHeight: 48, actionSlant: 12, height: 132, hintHeight: 24 } as const;

export const COUNT_LOCKUP = { maxFontScale: 1.15 } as const;

export const BOOST_CHIP = { height: 28, slant: 12, maxFontScale: 1.15 } as const;

export const FORGE = {
  heightRatio: 0.9,
  topSlant: 6,
  lift: 40,
  padX: PAGE_PADDING_X,
  fieldGap: 22,
  labelGap: 10,
  inputHeight: 56,
  inputSlant: 12,
  noteHeight: 72,
  scaleHeight: 64,
  footerTop: 14,
  maxFontScale: 1.15,
  weekdayChip: 40,
} as const;

export const DATE_STRIP = { days: 14, height: 44, slant: 12, minWidth: 64 } as const;

export const RANK_UP = { height: 76, slant: 14, top: 160, bleed: 28 } as const;
