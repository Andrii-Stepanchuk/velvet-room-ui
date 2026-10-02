import { memo } from 'react';
import { Text, View } from 'react-native';

import { arcanaById, challengeDef, effortDef, type Award, type Challenge, type Effort, type StatKey } from '@/lib/game';
import { formatMultiplier, formatPercent } from '@/lib/format';
import { STAT_TEXT_CLASS } from '@/lib/statStyle';
import { textGlow } from '@/lib/style';
import { FORGE } from '../../config/tasksLayout';

function skyLabel(award: Award): string | null {
  if (award.darkHour && award.fullMoon) return `${formatMultiplier(award.moonMult)} FULL MOON · DARK HOUR`;
  if (award.fullMoon) return `${formatMultiplier(award.moonMult)} FULL MOON`;
  if (award.darkHour) return `${formatMultiplier(award.moonMult)} DARK HOUR`;
  return null;
}

function blessingLabel(award: Award): string | null {
  if (award.blessingPct <= 0) return null;
  const name = arcanaById(award.arcanaId).name.toUpperCase();
  return award.blessingPct >= 1 ? `×2 ${name}` : `${formatPercent(award.blessingPct)} ${name}`;
}

export const ForgePrice = memo(function ForgePrice({
  stat,
  effort,
  challenge,
  base,
  live,
}: {
  stat: StatKey;
  effort: Effort;
  challenge: Challenge;
  base: number;
  live: Award;
}) {
  const e = effortDef(effort);
  const c = challengeDef(challenge);
  const extras = [skyLabel(live), blessingLabel(live)].filter((x): x is string => x !== null);
  const boosted = live.awarded !== base;
  const label = `Worth ${live.awarded} XP if cleared now. Base ${base} XP${extras.length > 0 ? `, ${extras.join(', ')}` : ''}`;
  return (
    <View className="flex-row items-center" accessible accessibilityLabel={label} accessibilityLiveRegion="polite">
      <View className="flex-row items-baseline">
        <Text maxFontSizeMultiplier={FORGE.maxFontScale} className={`font-display-italic text-xl ${STAT_TEXT_CLASS[stat]}`} style={textGlow}>
          +{live.awarded}
        </Text>
        <Text maxFontSizeMultiplier={FORGE.maxFontScale} className={`ml-1 font-display-italic text-md ${STAT_TEXT_CLASS[stat]}`}>
          XP
        </Text>
      </View>
      <View className="ml-4 flex-1">
        <Text numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={FORGE.maxFontScale} className="font-display-medium text-2xs tracking-sm text-secondary">
          {e.label} {e.points} × {c.label} ×{c.factor} = {base}
        </Text>
        {boosted && (
          <Text numberOfLines={2} maxFontSizeMultiplier={FORGE.maxFontScale} className="mt-1 font-display-medium text-2xs tracking-sm text-accent">
            NOW {extras.join(' · ')}
          </Text>
        )}
      </View>
    </View>
  );
});
