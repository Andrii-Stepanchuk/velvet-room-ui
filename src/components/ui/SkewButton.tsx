import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';
import { useLayoutSize } from '@/hooks/useLayoutSize';
import { slantOffset, withAlpha } from '@/lib/style';
import { SoftGlow } from './SoftGlow';

const SLANT = 11;
const GLOW = { spread: 26, offsetY: 8, opacity: 0.4 } as const;
const DISABLED_FILL = withAlpha(colors.background[600], 0.5);
const DISABLED_STROKE = withAlpha(colors.accent, 0.35);

export function SkewButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { size, onLayout } = useLayoutSize();
  const { width: w, height: h } = size;
  const offset = slantOffset(h, SLANT);
  const inset = disabled ? 0.5 : 0;
  const points = [
    `${offset + inset},${inset}`,
    `${w - inset},${inset}`,
    `${w - offset - inset},${h - inset}`,
    `${inset},${h - inset}`,
  ].join(' ');

  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityState={{ disabled }}>
      {({ pressed }) => (
        <View onLayout={onLayout}>
          {w > 0 && !disabled && (
            <View pointerEvents="none" style={[styles.glow, { width: w + GLOW.spread * 2, height: h + GLOW.spread * 2 }]}>
              <SoftGlow
                width={w + GLOW.spread * 2}
                height={h + GLOW.spread * 2}
                color={colors.glow[500]}
                opacity={GLOW.opacity}
              />
            </View>
          )}
          {w > 0 && (
            <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
              <Defs>
                <LinearGradient id="skewButtonFill" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset={0} stopColor={pressed ? colors.textPrimarySoft : colors.textPrimary} />
                  <Stop offset={1} stopColor={colors.textPrimarySoft} />
                </LinearGradient>
              </Defs>
              <Polygon
                points={points}
                fill={disabled ? DISABLED_FILL : 'url(#skewButtonFill)'}
                stroke={disabled ? DISABLED_STROKE : undefined}
                strokeWidth={disabled ? 1 : 0}
              />
            </Svg>
          )}
          <View className="py-4">
            <Text
              className={`text-center font-display-italic text-md tracking-xs ${disabled ? 'text-disabled' : 'text-ink'}`}
            >
              {label}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glow: { position: 'absolute', left: -GLOW.spread, top: -GLOW.spread + GLOW.offsetY },
});
