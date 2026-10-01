import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SectionLabel } from '@/components/ui';
import { ARCANA, type Arcana } from '@/lib/game';
import { useArcanaSheetStyles } from '../../hooks/useArcanaSheetStyles';
import { ArcanaCard } from './ArcanaCard';
import { ArcanaListRow } from './ArcanaListRow';

export const ArcanaSheet = memo(function ArcanaSheet({
  arcana,
  progress,
  onClose,
}: {
  arcana: Arcana;
  progress: SharedValue<number>;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { backdrop, sheet, height } = useArcanaSheetStyles(progress);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, backdrop]}>
        <Pressable onPress={onClose} accessibilityLabel="Close arcana" className="flex-1 bg-background-900/60" />
      </Animated.View>
      <Animated.View style={[styles.sheet, { height }, sheet]}>
        <View className="flex-1 border-t border-accent/30 bg-background-700/95" style={{ paddingBottom: insets.bottom }}>
          <View className="items-center pt-3">
            <View className="h-1 w-10 rounded-sm bg-accent/40" />
          </View>
          <ScrollView contentContainerClassName="px-5 pb-8 pt-4">
            <ArcanaCard arcana={arcana} />
            <SectionLabel label="ALL ARCANA" className="mb-2 mt-8" />
            {ARCANA.map((a) => (
              <ArcanaListRow key={a.id} arcana={a} current={a.id === arcana.id} />
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
