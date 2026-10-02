import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { DATE_BLADE } from '../config/tasksLayout';

const FILL = withAlpha(colors.background[700], 0.85);
const STROKE = withAlpha(colors.accent, 0.3);
const HIT_SLOP = { top: DATE_BLADE.hitSlop, bottom: DATE_BLADE.hitSlop };

export interface Segment<K extends string> {
  key: K;
  label: string;
  accessibilityLabel?: string;
}

function SegmentBladeBase<K extends string>({
  segments,
  value,
  onChange,
  label,
  compact = false,
}: {
  segments: readonly Segment<K>[];
  value: K;
  onChange: (key: K) => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <SkewPanel
      slant={DATE_BLADE.slant}
      fill={FILL}
      stroke={STROKE}
      className="flex-row"
      style={{ height: compact ? DATE_BLADE.compactHeight : DATE_BLADE.height }}
    >
      <View className="flex-1 flex-row" accessibilityRole="tablist" accessibilityLabel={label}>
        {segments.map((segment) => {
          const selected = segment.key === value;
          return (
            <Pressable
              key={segment.key}
              onPress={() => onChange(segment.key)}
              hitSlop={HIT_SLOP}
              accessibilityRole="tab"
              accessibilityLabel={segment.accessibilityLabel ?? segment.label}
              accessibilityState={{ selected }}
              style={{ flex: segment.label.length + 4 }}
            >
              {selected ? (
                <SkewPanel
                  slant={DATE_BLADE.slant}
                  fill={colors.textPrimary}
                  className="flex-1 items-center justify-center"
                >
                  <Text
                    maxFontSizeMultiplier={DATE_BLADE.maxFontScale}
                    numberOfLines={1}
                    className="font-display text-xs tracking-xs text-ink"
                  >
                    {segment.label}
                  </Text>
                </SkewPanel>
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Text
                    maxFontSizeMultiplier={DATE_BLADE.maxFontScale}
                    numberOfLines={1}
                    className="font-display text-xs tracking-xs text-secondary"
                  >
                    {segment.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </SkewPanel>
  );
}

export const SegmentBlade = memo(SegmentBladeBase) as typeof SegmentBladeBase;
