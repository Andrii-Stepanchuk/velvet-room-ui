import { memo } from 'react';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressRing = memo(function ProgressRing({
  size,
  strokeWidth,
  progress,
  color,
  trackColor,
  sweep,
}: {
  size: number;
  strokeWidth: number;
  progress: number;
  color: string;
  trackColor: string;
  sweep?: SharedValue<number>;
}) {
  const center = size / 2;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const arcProps = useAnimatedProps(() => {
    const reveal = sweep ? Math.min(Math.max(sweep.value, 0), 1) : 1;
    return { strokeDashoffset: circumference * (1 - clamped * reveal) };
  });

  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }}>
      <Circle cx={center} cy={center} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
      {clamped > 0 && (
        <AnimatedCircle
          cx={center}
          cy={center}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={arcProps}
          transform={`rotate(-90 ${center} ${center})`}
        />
      )}
    </Svg>
  );
});
