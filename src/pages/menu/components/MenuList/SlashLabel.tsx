import { memo } from 'react';
import { StyleSheet, Text, type LayoutChangeEvent } from 'react-native';

import { LOCKUP, WEDGE } from '../../config/menuLayout';
import { HalfPlaneClip } from './HalfPlaneClip';

export const SlashLabel = memo(function SlashLabel({
  label,
  frame,
  tip,
  onLabelLayout,
}: {
  label: string;
  frame: { width: number; height: number };
  tip: { x: number; y: number } | null;
  onLabelLayout: (e: LayoutChangeEvent) => void;
}) {
  return (
    <>
      <Text onLayout={onLabelLayout} maxFontSizeMultiplier={1} className="font-display-italic text-2xl text-white" style={styles.label}>
        {label}
      </Text>
      {tip && frame.width > 0 && (
        <HalfPlaneClip pivot={tip} angle={WEDGE.lowerDeg} keep="above" frame={frame}>
          <HalfPlaneClip pivot={tip} angle={WEDGE.upperDeg} keep="below" frame={frame}>
            <Text maxFontSizeMultiplier={1} className="font-display-italic text-2xl text-ink" style={styles.label}>
              {label}
            </Text>
          </HalfPlaneClip>
        </HalfPlaneClip>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    right: 0,
    top: LOCKUP.labelTop,
    lineHeight: LOCKUP.labelLine,
    paddingHorizontal: 2,
  },
});
