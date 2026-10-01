import { memo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import { useLayoutSize } from '@/hooks/useLayoutSize';

export const SkewPanel = memo(function SkewPanel({
  slant = 12,
  fill,
  stroke,
  className,
  style,
  children,
}: {
  slant?: number;
  fill: string;
  stroke?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const { size, onLayout } = useLayoutSize();
  const { width: w, height: h } = size;
  const inset = stroke ? 0.5 : 0;
  const offset = h * Math.tan((slant * Math.PI) / 180);
  const points = [
    `${offset + inset},${inset}`,
    `${w - inset},${inset}`,
    `${w - offset - inset},${h - inset}`,
    `${inset},${h - inset}`,
  ].join(' ');

  return (
    <View onLayout={onLayout} className={className} style={style}>
      {w > 0 && (
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Polygon points={points} fill={fill} stroke={stroke} strokeWidth={stroke ? 1 : 0} />
        </Svg>
      )}
      {children}
    </View>
  );
});
