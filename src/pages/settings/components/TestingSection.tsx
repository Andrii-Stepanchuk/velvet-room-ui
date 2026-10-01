import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SectionLabel, SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { BoostOverrideKey } from '@/lib/state/boostOverrides';
import { withAlpha } from '@/lib/style';
import type { TestingRow } from '../hooks/useTestingRows';

const OFF_FILL = withAlpha(colors.background[700], 0.4);
const OFF_STROKE = withAlpha(colors.accent, 0.3);

export const TestingSection = memo(function TestingSection({
  rows,
  onToggle,
}: {
  rows: readonly TestingRow[];
  onToggle: (key: BoostOverrideKey) => void;
}) {
  return (
    <View>
      <SectionLabel label="TESTING" className="mb-2" />
      {rows.map((row) => (
        <Pressable
          key={row.key}
          onPress={() => onToggle(row.key)}
          accessibilityRole="switch"
          accessibilityState={{ checked: row.on }}
          accessibilityLabel={row.label}
          className="min-h-12 flex-row items-center justify-between border-b border-accent/10 py-2"
        >
          <Text className="font-display-medium text-2xs tracking-lg text-muted">{row.label}</Text>
          <SkewPanel
            fill={row.on ? colors.accent : OFF_FILL}
            stroke={row.on ? undefined : OFF_STROKE}
            className="w-16 items-center py-1"
          >
            <Text className={`font-display text-2xs tracking-md ${row.on ? 'text-ink' : 'text-tertiary'}`}>
              {row.on ? 'ON' : 'OFF'}
            </Text>
          </SkewPanel>
        </Pressable>
      ))}
    </View>
  );
});
