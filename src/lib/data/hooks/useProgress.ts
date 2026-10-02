import { useContext } from 'react';

import { ProgressContext } from '../progress/ProgressProvider';
import type { Progress } from '../progress/buildProgress';

export function useProgress(): Progress {
  const progress = useContext(ProgressContext);
  if (!progress) throw new Error('useProgress needs a ProgressProvider');
  return progress;
}
