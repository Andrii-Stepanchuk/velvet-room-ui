import { memo } from 'react';
import { Text } from 'react-native';

import { moonCaption } from '@/lib/format';
import type { LunarCycle, MoonState } from '@/lib/game';
import { textShade } from '@/lib/style';
import { MOON_CAPTION } from '../config/statusLayout';

export const MoonCaption = memo(function MoonCaption({ moon, cycle }: { moon: MoonState; cycle: LunarCycle }) {
  const { text, label } = moonCaption(moon.name, cycle);
  return (
    <Text
      accessibilityLabel={label}
      maxFontSizeMultiplier={MOON_CAPTION.maxFontScale}
      className="text-center font-display-medium text-2xs tracking-lg text-secondary"
      style={textShade}
    >
      {text}
    </Text>
  );
});
