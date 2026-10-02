import { memo } from 'react';
import { Text, View } from 'react-native';

import { ActionPlate, SectionLabel } from '@/components/ui';
import { textShade } from '@/lib/style';

export const AccountSection = memo(function AccountSection({ onDelete }: { onDelete: () => void }) {
  return (
    <View>
      <SectionLabel label="ACCOUNT" className="mb-4" />
      <Text className="mb-4 font-body-medium text-sm text-secondary" style={textShade}>
        Erases your name and progress from this device. You&apos;ll be asked to confirm.
      </Text>
      <ActionPlate label="DELETE ACCOUNT" danger onPress={onDelete} accessibilityHint="Asks for confirmation first" />
    </View>
  );
});
