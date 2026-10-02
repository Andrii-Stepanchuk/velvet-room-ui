import { Easing } from 'react-native-reanimated';

import { PAGE_PADDING_X } from '@/constants/layout';
import { slantOffset } from '@/lib/style';

export const ARCANA_SHEET = {
  heightRatio: 0.8,
  inMs: 460,
  outMs: 260,
  reducedMs: 150,
  easingIn: Easing.out(Easing.cubic),
  easingOut: Easing.in(Easing.cubic),
  topSlant: 6,
  lift: 56,
  titleTop: 10,
  titleBleed: 6,
  titleLineHeight: 72,
  titleFadeDistance: 40,
  contentTop: 4,
  contentBottom: 96,
  backBottom: 16,
  layers: { count: 6, spread: 0.5, slide: 80, titleSlide: 60 },
} as const;

export const ARCANA_HERO = {
  plateTop: 14,
  bodyTop: 22,
  blessingTop: 36,
} as const;

export const ARCANA_BAND = {
  height: 44,
  slant: 12,
  bleed: PAGE_PADDING_X + slantOffset(44, 12),
  endInset: 44,
} as const;

export const ARCANA_PLATE = {
  slant: 8,
  bleed: PAGE_PADDING_X + slantOffset(170, 8),
  endInset: 4,
  nameLineHeight: 40,
  numeralLineHeight: 64,
  numeralMaxWidth: 132,
  tagSlant: 12,
  tagTop: -10,
  tagInset: 6,
  tagRotate: -8,
} as const;

export const ARCANA_CARD = {
  rotate: 7,
  enterRotate: 18,
  drop: 40,
  overlap: 14,
  gap: 14,
  edgeInset: 2,
} as const;

export const ARCANA_BLESSING = {
  slant: 6,
  indent: 28,
  bleed: PAGE_PADDING_X + slantOffset(140, 6),
  paddingLeft: 22,
  headingTop: -15,
  headingLeft: 14,
  sliverSlant: 12,
  sliverOverhang: 8,
  sliverHeight: 11,
} as const;

export const ARCANA_ROW = {
  height: 56,
  slant: 12,
  tagSlant: 12,
  bleed: PAGE_PADDING_X + slantOffset(56, 12),
} as const;
