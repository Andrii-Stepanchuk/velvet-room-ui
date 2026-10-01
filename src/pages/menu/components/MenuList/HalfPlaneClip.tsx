import { memo, type ReactNode } from 'react';
import { View } from 'react-native';

const SPAN = 2400;

export const HalfPlaneClip = memo(function HalfPlaneClip({
  pivot,
  angle,
  keep,
  frame,
  children,
}: {
  pivot: { x: number; y: number };
  angle: number;
  keep: 'above' | 'below';
  frame: { width: number; height: number };
  children: ReactNode;
}) {
  const left = pivot.x - SPAN / 2;
  const top = keep === 'above' ? pivot.y - SPAN : pivot.y;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        top,
        width: SPAN,
        height: SPAN,
        overflow: 'hidden',
        transformOrigin: [SPAN / 2, keep === 'above' ? SPAN : 0, 0],
        transform: [{ rotate: `${angle}deg` }],
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: -left,
          top: -top,
          width: frame.width,
          height: frame.height,
          transformOrigin: [pivot.x, pivot.y, 0],
          transform: [{ rotate: `${-angle}deg` }],
        }}
      >
        {children}
      </View>
    </View>
  );
});
