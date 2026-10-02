import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Polygon, Rect, Stop } from 'react-native-svg';

import { TAROT_CARD } from '@/constants/tarotCard';
import { colors } from '@/constants/theme';
import type { Arcana } from '@/lib/game';
import { glowShadow, withAlpha } from '@/lib/style';
import { MoonDisc } from './MoonDisc';
import { StatIcon } from './StatIcon';

const { width: W, height: H, emblemY: CY, archTop: ARCH_TOP, archRadius: AR, emblemBox: BOX } = TAROT_CARD;
const CX = W / 2;
const RAYS = Array.from({ length: 24 }, (_, i) => ({ angle: (i * Math.PI) / 12, length: i % 2 === 0 ? 42 : 37 }));
const FRAME = colors.textPrimary;
const HAIRLINE = withAlpha(colors.accent, 0.55);
const FAINT = withAlpha(colors.accent, 0.22);
const ARCH = `M${CX - AR} ${H - 8} V${ARCH_TOP + AR} A${AR} ${AR} 0 0 1 ${CX + AR} ${ARCH_TOP + AR} V${H - 8} Z`;

function diamond(r: number): string {
  return `${CX},${CY - r} ${CX + r},${CY} ${CX},${CY + r} ${CX - r},${CY}`;
}

export const TarotCard = memo(function TarotCard({ arcana }: { arcana: Arcana }) {
  return (
    <View style={styles.card} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="tarotFace" x1="0" y1="0" x2="0" y2="1">
            <Stop offset={0} stopColor={colors.background[400]} />
            <Stop offset={1} stopColor={colors.background[600]} />
          </LinearGradient>
        </Defs>
        <Rect
          x={0.75}
          y={0.75}
          width={W - 1.5}
          height={H - 1.5}
          rx={3}
          fill={colors.ink}
          stroke={FRAME}
          strokeWidth={1.5}
        />
        <Rect x={6} y={6} width={W - 12} height={H - 22} fill="url(#tarotFace)" stroke={HAIRLINE} strokeWidth={0.75} />
        <Path d={`M${CX} 12 V${ARCH_TOP}`} stroke={FAINT} strokeWidth={0.75} />
        {RAYS.map(({ angle, length }) => (
          <Line
            key={angle}
            x1={CX + Math.cos(angle) * 26}
            y1={CY + Math.sin(angle) * 26}
            x2={CX + Math.cos(angle) * length}
            y2={CY + Math.sin(angle) * length}
            stroke={FAINT}
            strokeWidth={0.75}
          />
        ))}
        <Circle cx={CX} cy={CY} r={39} fill="none" stroke={FAINT} strokeWidth={0.5} />
        <Polygon points={diamond(35)} fill="none" stroke={HAIRLINE} strokeWidth={0.75} />
        <Polygon points={diamond(30)} fill={colors.ink} stroke={HAIRLINE} strokeWidth={1} />
        {[12, W - 12].map((x) => (
          <Circle key={x} cx={x} cy={12} r={1.25} fill={HAIRLINE} />
        ))}
        <Path d={ARCH} fill={colors.ink} stroke={FRAME} strokeWidth={1} />
      </Svg>
      <View style={styles.emblem}>
        {arcana.stats ? (
          arcana.stats.map((key) => (
            <StatIcon key={key} stat={key} size={TAROT_CARD.iconSize} color={colors.stat[key]} />
          ))
        ) : (
          <MoonDisc
            size={TAROT_CARD.moonSize}
            illumination={arcana.id === 'world' ? 1 : TAROT_CARD.foolIllumination}
            waxing
          />
        )}
      </View>
      <View style={styles.arch}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1}
          className="font-display-italic text-sm text-primary"
        >
          {arcana.numeral}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: W,
    height: H,
    borderRadius: 3,
    backgroundColor: colors.ink,
    ...glowShadow(colors.glow[500], { opacity: 0.5, radius: 18, elevation: 12, offsetY: 6 }),
  },
  emblem: {
    position: 'absolute',
    left: CX - BOX / 2,
    top: CY - BOX / 2,
    width: BOX,
    height: BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arch: { position: 'absolute', left: CX - AR + 2, width: AR * 2 - 4, top: ARCH_TOP + 12, alignItems: 'center' },
});
