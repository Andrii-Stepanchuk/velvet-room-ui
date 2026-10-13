import { memo, useMemo } from 'react';
import { StyleSheet, View, type AccessibilityActionEvent } from 'react-native';
import { GestureDetector, type ComposedGesture } from 'react-native-gesture-handler';
import Animated, { type SharedValue } from 'react-native-reanimated';

import type { DayKey } from '@/lib/game';
import type { LayerStyle } from '@/lib/motion';
import { TRACK } from '../../config/trackLayout';
import type { TrackGeometry } from '../../hooks/useTrackGeometry';
import { MonthLockup } from './MonthLockup';
import { RadarRings } from './RadarRings';
import { TrackBand } from './TrackBand';
import { TrackLine } from './TrackLine';
import { TrackNode } from './TrackNode';

const ACTIONS = [
  { name: 'increment', label: 'Next day' },
  { name: 'decrement', label: 'Previous day' },
];

export const MoonTrack = memo(function MoonTrack({
  g,
  anchor,
  lastIndex,
  selected,
  focusDate,
  today,
  label,
  dayAt,
  scroll,
  moving,
  progress,
  gesture,
  layers,
  onStep,
  onOpenMonth,
}: {
  g: TrackGeometry;
  anchor: number;
  lastIndex: number;
  selected: DayKey;
  focusDate: Date;
  today: DayKey;
  label: string;
  dayAt: (index: number) => DayKey;
  scroll: SharedValue<number>;
  moving: SharedValue<number>;
  progress: SharedValue<number>;
  gesture: ComposedGesture;
  layers: { band: LayerStyle; line: LayerStyle; lockup: LayerStyle; track: LayerStyle };
  onStep: (delta: number) => void;
  onOpenMonth: () => void;
}) {
  const indexes = useMemo(() => {
    const from = Math.max(0, anchor - TRACK.pastWindow);
    const to = Math.min(lastIndex + TRACK.futureWindow, anchor + TRACK.futureWindow + 1);
    return Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
  }, [anchor, lastIndex]);

  const onAction = (e: AccessibilityActionEvent) => {
    if (e.nativeEvent.actionName === 'increment') onStep(1);
    if (e.nativeEvent.actionName === 'decrement') onStep(-1);
  };

  return (
    <View style={{ height: g.height }}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, layers.band]}>
        <TrackBand g={g} />
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[StyleSheet.absoluteFill, layers.track]}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={label}
          accessibilityHint="Swipe up or down to move between days"
          accessibilityActions={ACTIONS}
          onAccessibilityAction={onAction}
        >
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, layers.line]}>
            <TrackLine g={g} />
          </Animated.View>
          <RadarRings selected={selected} moving={moving} progress={progress} g={g} />
          {indexes.map((index) => {
            const day = dayAt(index);
            return (
              <TrackNode
                key={day}
                day={day}
                index={index}
                isToday={day === today}
                future={index > lastIndex}
                scroll={scroll}
                progress={progress}
                g={g}
              />
            );
          })}
        </Animated.View>
      </GestureDetector>
      <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill, layers.lockup]}>
        <MonthLockup date={focusDate} g={g} onPress={onOpenMonth} />
      </Animated.View>
    </View>
  );
});
