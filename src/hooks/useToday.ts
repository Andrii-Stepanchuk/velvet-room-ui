import { dayKey, type DayKey } from '@/lib/game';
import { useNow } from './useNow';

export function useToday(): DayKey {
  return dayKey(useNow());
}
