import { memo } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';

import { POP_POOL, useBubbleField, type AmbientSpec } from '../../hooks/useBubbles';
import { AmbientBubble } from './AmbientBubble';
import { PopBubble } from './PopBubble';

const AMBIENT_SEED: AmbientSpec[] = [
  { id: 0, leftFraction: 0.08, sizePx: 13, riseMs: 13000, delayMs: 0, swayHalfPeriodMs: 3600 },
  { id: 1, leftFraction: 0.17, sizePx: 6, riseMs: 10000, delayMs: 2400, swayHalfPeriodMs: 2800 },
  { id: 2, leftFraction: 0.26, sizePx: 9, riseMs: 15000, delayMs: 5200, swayHalfPeriodMs: 4400 },
  { id: 3, leftFraction: 0.34, sizePx: 4, riseMs: 9000, delayMs: 1100, swayHalfPeriodMs: 2200 },
  { id: 4, leftFraction: 0.44, sizePx: 16, riseMs: 17000, delayMs: 6800, swayHalfPeriodMs: 5200 },
  { id: 5, leftFraction: 0.52, sizePx: 7, riseMs: 11500, delayMs: 3600, swayHalfPeriodMs: 3100 },
  { id: 6, leftFraction: 0.61, sizePx: 11, riseMs: 14000, delayMs: 8400, swayHalfPeriodMs: 4000 },
  { id: 7, leftFraction: 0.7, sizePx: 5, riseMs: 9500, delayMs: 700, swayHalfPeriodMs: 2500 },
  { id: 8, leftFraction: 0.78, sizePx: 14, riseMs: 16000, delayMs: 4300, swayHalfPeriodMs: 4800 },
  { id: 9, leftFraction: 0.87, sizePx: 8, riseMs: 12000, delayMs: 7100, swayHalfPeriodMs: 3400 },
  { id: 10, leftFraction: 0.94, sizePx: 5, riseMs: 10500, delayMs: 2000, swayHalfPeriodMs: 2600 },
  { id: 11, leftFraction: 0.38, sizePx: 10, riseMs: 18000, delayMs: 9600, swayHalfPeriodMs: 4600 },
];

const POP_INDICES = Array.from({ length: POP_POOL }, (_, i) => i);

export const BubbleField = memo(function BubbleField() {
  const { width, height } = useWindowDimensions();
  const { clock, pops, onPressIn } = useBubbleField();

  return (
    <>
      {AMBIENT_SEED.map((spec) => (
        <AmbientBubble key={spec.id} spec={spec} clock={clock} width={width} height={height} />
      ))}
      {POP_INDICES.map((i) => (
        <PopBubble key={i} index={i} pops={pops} clock={clock} />
      ))}
      <Pressable style={StyleSheet.absoluteFill} onPressIn={onPressIn} />
    </>
  );
});
