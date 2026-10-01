import { useCallback, useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

import { useLayoutSize } from '@/hooks/useLayoutSize';
import { WEDGE } from '../config/menuLayout';

export interface LockupGeometry {
  tip: { x: number; y: number };
  wedgePoints: string;
  wedgeWidth: number;
}

function slope(deg: number) {
  return Math.tan((deg * Math.PI) / 180);
}

export function useLockupGeometry() {
  const { size: frame, onLayout: onFrameLayout } = useLayoutSize();
  const [labelStart, setLabelStart] = useState<number | null>(null);

  const onLabelLayout = useCallback((e: LayoutChangeEvent) => {
    const { x } = e.nativeEvent.layout;
    setLabelStart((prev) => (prev === x ? prev : x));
  }, []);

  const geometry = useMemo<LockupGeometry | null>(() => {
    if (labelStart === null) return null;
    const tip = { x: labelStart - WEDGE.tipGap, y: WEDGE.tipY };
    const rise = WEDGE.capY - tip.y;
    const upperX = tip.x + rise / slope(WEDGE.upperDeg);
    const lowerX = tip.x + rise / slope(WEDGE.lowerDeg);
    const shift = -WEDGE.capY;
    const wedgePoints = [
      `${tip.x},${tip.y + shift}`,
      `${upperX},${WEDGE.capY + shift}`,
      `${lowerX},${WEDGE.capY + shift}`,
    ].join(' ');
    return { tip, wedgePoints, wedgeWidth: lowerX + 2 };
  }, [labelStart]);

  return { frame, onFrameLayout, onLabelLayout, geometry };
}
