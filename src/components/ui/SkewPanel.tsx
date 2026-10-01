import { memo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import { useLayoutSize } from '@/hooks/useLayoutSize';

const SHADOW_OFFSETS = [3, 2, 1] as const;
const SHADOW_SVG_STYLE: ViewStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: -SHADOW_OFFSETS[0], overflow: 'visible' };

export const SkewPanel = memo(function SkewPanel({
  slant = 12,
  fill,
  stroke,
  shadow,
  className,
  style,
  children,
}: {
  slant?: number;
  fill: string;
  stroke?: string;
  shadow?: string;
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
  const svgStyle = shadow ? SHADOW_SVG_STYLE : StyleSheet.absoluteFill;

  return (
    <View onLayout={onLayout} className={className} style={style}>
      {w > 0 && (
        <Svg style={svgStyle} pointerEvents="none">
          {shadow &&
            SHADOW_OFFSETS.map((dy) => (
              <Polygon key={dy} points={points} fill={shadow} fillOpacity={0.3} translateY={dy} />
            ))}
          <Polygon points={points} fill={fill} stroke={stroke} strokeWidth={stroke ? 1 : 0} />
        </Svg>
      )}
      {children}
    </View>
  );
});
