import { memo } from 'react';
import { Text, View } from 'react-native';

import { NameInput, SkewButton } from '@/components/ui';
import { AccentDivider } from './AccentDivider';
import { useNameEntry } from '../../hooks/useNameEntry';

export const RegisterForm = memo(function RegisterForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const { value, setValue, name, canSubmit, submit } = useNameEntry(onSubmit);

  return (
    <View className="px-[26px] pt-4">
      <AccentDivider label="SPEAK YOUR NAME" className="mb-3.5" />

      <NameInput value={value} onChangeText={setValue} className="mb-4" />

      <SkewButton label="OPEN THE DOOR ▸" onPress={submit} disabled={!canSubmit} />

      <Text className="mt-[13px] text-center font-body-italic text-sm text-hint">
        {canSubmit ? `The door is waiting, ${name}.` : 'A contract needs a name.'}
      </Text>
    </View>
  );
});
