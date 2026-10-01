import { memo } from 'react';
import { Text, View } from 'react-native';

export const ArcanaInfoRow = memo(function ArcanaInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="border-l-2 border-accent/40 pl-3">
      <Text className="font-display-medium text-2xs tracking-lg text-muted">{label}</Text>
      <Text className="mt-1 font-body-medium text-sm text-primary">{value}</Text>
    </View>
  );
});
