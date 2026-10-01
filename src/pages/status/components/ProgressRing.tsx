import { memo } from 'react';
import Svg, { Circle } from 'react-native-svg';

export const ProgressRing = memo(function ProgressRing({
  size,
  strokeWidth,
  progress,
  color,
  trackColor,
}: {
  size: number;
  strokeWidth: number;
  progress: number;
  color: string;
  trackColor: string;
}) {
  const center = size / 2;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }}>
      <Circle cx={center} cy={center} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
      <Circle
        cx={center}
        cy={center}
        r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={circumference * (1 - clamped)}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </Svg>
  );
});
