import { memo } from 'react';
import { Text, View } from 'react-native';

import { SectionLabel } from '@/components/ui';
import { textShade } from '@/lib/style';
import { ActionPlate } from './ActionPlate';

export const EntranceSection = memo(function EntranceSection({ onReplay }: { onReplay: () => void }) {
  return (
    <View>
      <SectionLabel label="ENTRANCE" className="mb-4" />
      <Text className="mb-4 font-body-italic text-md text-hint" style={textShade}>
        Walk through the velvet door once more.
      </Text>
      <ActionPlate label="REPLAY ENTRANCE" chevron onPress={onReplay} accessibilityHint="Plays the entrance again" />
    </View>
  );
});
