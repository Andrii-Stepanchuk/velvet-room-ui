import { useMemo } from 'react';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

export function SoftGlow({
  width,
  height,
  color,
  opacity = 0.6,
}: {
  width: number;
  height: number;
  color: string;
  opacity?: number;
}) {
  const id = useMemo(() => `g${Math.round(width)}_${Math.round(height)}_${color.replace(/\W/g, '')}`, [
    width,
    height,
    color,
  ]);
  return (
    <Svg width={width} height={height}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={color} stopOpacity={opacity} />
          <Stop offset="0.55" stopColor={color} stopOpacity={opacity * 0.4} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={`url(#${id})`} />
    </Svg>
  );
}
