import { memo } from 'react';
import { Text, View } from 'react-native';

import { SectionLabel } from '@/components/ui';
import type { BoostRow } from '../hooks/useBoostRows';

export const BoostsSection = memo(function BoostsSection({ rows }: { rows: readonly BoostRow[] }) {
  return (
    <View>
      <SectionLabel label="BOOSTS" className="mb-2" />
      {rows.map((row) => (
        <View key={row.label} className="flex-row items-center justify-between border-b border-accent/10 py-3">
          <Text className="font-display-medium text-2xs tracking-lg text-muted">{row.label}</Text>
          <Text className="font-body-medium text-sm text-primary">{row.value}</Text>
        </View>
      ))}
    </View>
  );
});
