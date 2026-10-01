import { memo } from 'react';
import { View } from 'react-native';

import { NameInput, SectionLabel, SkewButton } from '@/components/ui';
import { DeleteAccountButton } from './DeleteAccountButton';

export const ProfileSection = memo(function ProfileSection({
  value,
  onChangeText,
  canSave,
  onSave,
  onDelete,
}: {
  value: string;
  onChangeText: (value: string) => void;
  canSave: boolean;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <View>
      <SectionLabel label="PROFILE" className="mb-4" />
      <NameInput value={value} onChangeText={onChangeText} className="mb-4" />
      <SkewButton label="SAVE NAME ▸" onPress={onSave} disabled={!canSave} />
      <View className="mt-5 items-center">
        <DeleteAccountButton onPress={onDelete} />
      </View>
    </View>
  );
});
