import { memo } from 'react';
import { Text, View } from 'react-native';

import type { Boosts } from '@/lib/game';
import { countdownCopy } from '@/lib/format';
import { textGlow, textShade } from '@/lib/style';

const NUMERAL_STYLE = [textShade, { lineHeight: 64 }];
const NUMERAL_GLOW_STYLE = [textGlow, { lineHeight: 64 }];
const UNIT_STYLE = [textShade, { lineHeight: 24 }];
const MAX_SCALE = 1.15;

export const CountdownLockup = memo(function CountdownLockup({
  daysUntilFullMoon,
  boosts,
}: {
  daysUntilFullMoon: number;
  boosts: Boosts;
}) {
  const { value, unit, caption, label } = countdownCopy(daysUntilFullMoon, boosts);
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={label} className="flex-row items-center self-center">
      <Text
        maxFontSizeMultiplier={MAX_SCALE}
        className="font-display-italic text-3xl text-white"
        style={boosts.darkHour ? NUMERAL_GLOW_STYLE : NUMERAL_STYLE}
      >
        {value}
      </Text>
      <View className="ml-3">
        <Text maxFontSizeMultiplier={MAX_SCALE} className="font-display-italic text-lg text-white" style={UNIT_STYLE}>
          {unit}
        </Text>
        <Text maxFontSizeMultiplier={MAX_SCALE} className="mt-0.5 font-display text-sm tracking-sm text-primary" style={textShade}>
          {caption}
        </Text>
      </View>
    </View>
  );
});
