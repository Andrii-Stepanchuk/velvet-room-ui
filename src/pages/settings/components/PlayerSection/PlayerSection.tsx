import { memo } from 'react';
import { Text, View } from 'react-native';

import { SectionLabel } from '@/components/ui';
import { textShade } from '@/lib/style';
import { RenameField } from './RenameField';

export const PlayerSection = memo(function PlayerSection({
  value,
  onChangeText,
  canSave,
  empty,
  onSave,
}: {
  value: string;
  onChangeText: (value: string) => void;
  canSave: boolean;
  empty: boolean;
  onSave: () => void;
}) {
  return (
    <View>
      <SectionLabel label="PLAYER" className="mb-4" />
      <RenameField value={value} onChangeText={onChangeText} canSave={canSave} onSave={onSave} />
      <Text className="mt-3 font-body-medium text-sm text-secondary" style={textShade}>
        {empty ? 'Enter a name to save it.' : 'Up to 18 letters, shown on your Status plate.'}
      </Text>
    </View>
  );
});
