import { memo } from 'react';
import { Text, View } from 'react-native';
import Clock3 from 'lucide-react-native/icons/clock-3';
import Layers2 from 'lucide-react-native/icons/layers-2';

import { MoonDisc, SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { textGlow, textShade, withAlpha } from '@/lib/style';
import { BOOST_LOCKUP } from '../../config/settingsLayout';
import type { BoostRow } from '../../hooks/useBoostRows';

const LIVE_FILL = withAlpha(colors.accent, 0.15);
const NUMERAL_BOX = { width: BOOST_LOCKUP.numeralWidth, lineHeight: BOOST_LOCKUP.numeralLine };
const NUMERAL_STYLE = [textShade, NUMERAL_BOX];
const NUMERAL_LIVE_STYLE = [textGlow, NUMERAL_BOX];

function BoostGlyph({ kind }: { kind: BoostRow['key'] }) {
  if (kind === 'fullMoon') return <MoonDisc size={BOOST_LOCKUP.glyph} illumination={1} waxing />;
  const Icon = kind === 'darkHour' ? Clock3 : Layers2;
  return <Icon size={BOOST_LOCKUP.glyph} color={colors.accent} strokeWidth={BOOST_LOCKUP.glyphStroke} />;
}

export const BoostLockup = memo(function BoostLockup({ row }: { row: BoostRow }) {
  return (
    <View accessible accessibilityLabel={row.label} className="flex-row items-center">
      <Text
        maxFontSizeMultiplier={BOOST_LOCKUP.maxFontScale}
        className={`font-display-italic text-xl ${row.live ? 'text-accent' : 'text-white'}`}
        style={row.live ? NUMERAL_LIVE_STYLE : NUMERAL_STYLE}
      >
        {row.value}
      </Text>
      <View className="ml-2 flex-1">
        <View className="flex-row items-center">
          <View className="mr-2">
            <BoostGlyph kind={row.key} />
          </View>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={BOOST_LOCKUP.maxFontScale}
            className="shrink font-display-italic text-md text-white"
            style={textShade}
          >
            {row.unit}
          </Text>
          {row.live && (
            <SkewPanel fill={LIVE_FILL} className="ml-2.5 px-3.5 py-1">
              <Text
                maxFontSizeMultiplier={BOOST_LOCKUP.maxFontScale}
                className="font-display-medium text-2xs tracking-lg text-accent"
              >
                LIVE
              </Text>
            </SkewPanel>
          )}
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={BOOST_LOCKUP.maxFontScale}
          className="mt-1 font-display text-sm tracking-xs text-primary"
          style={textShade}
        >
          {row.caption}
        </Text>
      </View>
    </View>
  );
});
