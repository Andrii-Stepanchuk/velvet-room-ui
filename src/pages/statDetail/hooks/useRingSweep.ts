import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { ramp } from '@/lib/motion';
import { RING_SWEEP } from '../config/statDetailTiming';

export function useRingSweep(progress: SharedValue<number>) {
  return useDerivedValue(() => ramp(progress.value, RING_SWEEP.start, RING_SWEEP.end));
}
