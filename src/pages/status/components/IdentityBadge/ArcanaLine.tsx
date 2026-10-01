import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { Arcana } from '@/lib/game';
import { withAlpha } from '@/lib/style';
import { ARCANA_TAG } from '../../config/statusLayout';
import { MiniTarot } from './MiniTarot';

const FILL = withAlpha(colors.background[700], 0.85);
const FILL_PRESSED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.3);
const STROKE_PRESSED = withAlpha(colors.accent, 0.6);
const SLANT_OFFSET = ARCANA_TAG.height * Math.tan((ARCANA_TAG.slant * Math.PI) / 180);
const PLATE_STYLE = { height: ARCANA_TAG.height, paddingLeft: SLANT_OFFSET + 3, paddingRight: SLANT_OFFSET + 12 };
const HIT_SLOP = { top: ARCANA_TAG.hitSlop, bottom: ARCANA_TAG.hitSlop, left: 8, right: 8 };

export const ArcanaLine = memo(function ArcanaLine({ arcana, onPress }: { arcana: Arcana; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={`Arcana ${arcana.numeral}, ${arcana.name}`}
      accessibilityHint="Opens the Arcana card"
      className="max-w-[86%]"
    >
      {({ pressed }) => (
        <SkewPanel
          slant={ARCANA_TAG.slant}
          fill={pressed ? FILL_PRESSED : FILL}
          stroke={pressed ? STROKE_PRESSED : STROKE}
          className="flex-row items-center"
          style={PLATE_STYLE}
        >
          <MiniTarot numeral={arcana.numeral} />
          <View className="ml-3 shrink">
            <Text
              maxFontSizeMultiplier={ARCANA_TAG.maxFontScale}
              className="font-display-medium text-2xs leading-3 tracking-md text-accent"
            >
              ARCANA
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={ARCANA_TAG.maxFontScale}
              className="mt-0.5 font-display-italic text-sm leading-4 tracking-xs text-primary"
            >
              {arcana.name.toUpperCase()}
            </Text>
          </View>
          <View className="ml-3.5 h-6 w-px bg-accent/30" />
          <Text maxFontSizeMultiplier={ARCANA_TAG.maxFontScale} className="ml-2.5 font-display text-md text-accent">
            ▸
          </Text>
        </SkewPanel>
      )}
    </Pressable>
  );
});
