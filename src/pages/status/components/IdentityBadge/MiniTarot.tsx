import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Rect, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { ARCANA_TAG } from '../../config/statusLayout';

const { width: W, height: H, inset: IN, tilt, pip: P } = ARCANA_TAG.card;
const CX = W / 2;
const PIP_Y = IN + 7;
const HAIRLINE = withAlpha(colors.accent, 0.55);
const PIP = `${CX},${PIP_Y - P} ${CX + P},${PIP_Y} ${CX},${PIP_Y + P} ${CX - P},${PIP_Y}`;

export const MiniTarot = memo(function MiniTarot({ numeral }: { numeral: string }) {
  return (
    <View style={styles.card} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="miniTarotFace" x1="0" y1="0" x2="0" y2="1">
            <Stop offset={0} stopColor={colors.background[400]} />
            <Stop offset={1} stopColor={colors.background[600]} />
          </LinearGradient>
        </Defs>
        <Rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={2} fill={colors.ink} stroke={colors.textPrimary} strokeWidth={1} />
        <Rect
          x={IN}
          y={IN}
          width={W - IN * 2}
          height={H - IN * 2}
          fill="url(#miniTarotFace)"
          stroke={HAIRLINE}
          strokeWidth={0.75}
        />
        <Polygon points={PIP} fill={colors.ink} stroke={HAIRLINE} strokeWidth={0.75} />
      </Svg>
      <View style={styles.numeral}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1}
          className="font-display-italic text-2xs text-primary"
        >
          {numeral}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { width: W, height: H, transform: [{ rotate: `${tilt}deg` }] },
  numeral: {
    position: 'absolute',
    left: IN + 1,
    right: IN + 1,
    bottom: IN + 3,
    alignItems: 'center',
  },
});
