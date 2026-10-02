import { memo, useEffect, useRef } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View, findNodeHandle } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackTab, SectionLabel, SheetSurface } from '@/components/ui';
import { PAGE_PADDING_X } from '@/constants/layout';
import { ARCANA, type Arcana } from '@/lib/game';
import { textShade } from '@/lib/style';
import { ARCANA_SHEET } from '../../config/arcanaSheet';
import { useArcanaSheetStyles } from '../../hooks/useArcanaSheetStyles';
import { ArcanaCard } from './ArcanaCard';
import { ArcanaListRow } from './ArcanaListRow';

const TITLE_STYLE = [textShade, { lineHeight: ARCANA_SHEET.titleLineHeight }];

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
  const { backdrop, sheet, onScroll, width, height, rise, layers } = useArcanaSheetStyles(progress);
  const titleRef = useRef<Text>(null);

  useEffect(() => {
    const node = findNodeHandle(titleRef.current);
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, backdrop]}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close Arcana"
          className="flex-1 bg-background-900/90"
        />
      </Animated.View>
      <Animated.View pointerEvents="box-none" style={[styles.sheet, { height: height + ARCANA_SHEET.lift }, sheet]}>
        <SheetSurface width={width} height={height + rise} rise={rise} top={ARCANA_SHEET.lift - rise} gradientId="arcanaField" />
        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + ARCANA_SHEET.contentBottom }]}
        >
          <ArcanaCard arcana={arcana} layers={layers} />
          <SectionLabel label="ALL ARCANA" className="mb-1 mt-12" />
          {ARCANA.map((a) => (
            <ArcanaListRow key={a.id} arcana={a} current={a.id === arcana.id} />
          ))}
        </Animated.ScrollView>
        <Animated.View pointerEvents="none" style={[styles.title, layers.title]}>
          <Text
            ref={titleRef}
            accessibilityRole="header"
            maxFontSizeMultiplier={1}
            className="font-display-italic text-4xl text-white"
            style={TITLE_STYLE}
          >
            ARCANA
          </Text>
        </Animated.View>
        <View style={[styles.back, { bottom: insets.bottom + ARCANA_SHEET.backBottom }]}>
          <BackTab onPress={onClose} />
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  title: {
    position: 'absolute',
    top: ARCANA_SHEET.titleTop,
    left: -ARCANA_SHEET.titleBleed,
  },
  scroll: { flex: 1, marginTop: ARCANA_SHEET.lift },
  content: {
    paddingHorizontal: PAGE_PADDING_X,
    paddingTop: ARCANA_SHEET.contentTop,
  },
  back: { position: 'absolute', right: PAGE_PADDING_X },
});
