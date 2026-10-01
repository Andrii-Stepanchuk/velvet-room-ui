import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SectionLabel } from '@/components/ui';

export const EntranceSection = memo(function EntranceSection({ onReplay }: { onReplay: () => void }) {
  return (
    <View>
      <SectionLabel label="ENTRANCE" className="mb-4" />
      <Text className="mb-4 font-body-italic text-sm text-hint">Walk through the velvet door once more.</Text>
      <Pressable
        onPress={onReplay}
        accessibilityRole="button"
        className="self-start border border-accent/30 bg-background-700/40 px-6 py-[11px]"
      >
        <Text className="font-display-medium text-xs tracking-md text-secondary">REPLAY ENTRANCE ▸</Text>
      </Pressable>
    </View>
  );
});
