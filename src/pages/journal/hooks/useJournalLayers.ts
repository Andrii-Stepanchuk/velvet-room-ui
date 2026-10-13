import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { slideIn, staggered } from '@/lib/motion';
import { JOURNAL_SLIDE, JOURNAL_STAGGER } from '../config/journalTiming';

const { layers, spread } = JOURNAL_STAGGER;

export function useJournalLayers(progress: SharedValue<number>, fade: SharedValue<number>) {
  const band = useAnimatedStyle(() => slideIn(staggered(progress.value, 0, layers, spread), JOURNAL_SLIDE.band, 0));
  const line = useAnimatedStyle(() => slideIn(staggered(progress.value, 0, layers, spread), JOURNAL_SLIDE.band, 0));
  const lockup = useAnimatedStyle(() => slideIn(staggered(progress.value, 1, layers, spread), JOURNAL_SLIDE.lockup, 0));
  const track = useAnimatedStyle(() => ({ opacity: fade.value }));
  const log = useAnimatedStyle(() => slideIn(staggered(progress.value, 3, layers, spread), 0, JOURNAL_SLIDE.log));
  return { band, line, lockup, track, log };
}
