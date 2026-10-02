import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { FORGE } from '../../config/tasksLayout';

const BELOW = withAlpha(colors.accent, 0.45);
const ABOVE = withAlpha(colors.background[700], 0.6);
const ABOVE_STROKE = withAlpha(colors.accent, 0.22);

export interface ScaleOption<K extends string> {
  key: K;
  label: string;
  detail: string;
}

function ScalePickerBase<K extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly ScaleOption<K>[];
  value: K;
  onChange: (key: K) => void;
  label: string;
}) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.key === value),
  );
  const step = (FORGE.scaleHeight - 34) / Math.max(options.length - 1, 1);
  return (
    <View className="flex-row gap-1.5" accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((option, i) => {
        const selected = i === selectedIndex;
        const fill = selected ? colors.accent : i < selectedIndex ? BELOW : ABOVE;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            className="flex-1 items-stretch justify-end"
            style={{ height: FORGE.scaleHeight + 22 }}
            accessibilityRole="radio"
            accessibilityLabel={`${option.label}, ${option.detail}`}
            accessibilityState={{ selected }}
          >
            <SkewPanel
              slant={12}
              fill={fill}
              stroke={i > selectedIndex ? ABOVE_STROKE : undefined}
              style={{ height: 14 + step * i }}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={FORGE.maxFontScale}
              className={`mt-2 text-center font-display text-2xs tracking-xs ${selected ? 'text-white' : 'text-tertiary'}`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const ScalePicker = memo(ScalePickerBase) as typeof ScalePickerBase;
