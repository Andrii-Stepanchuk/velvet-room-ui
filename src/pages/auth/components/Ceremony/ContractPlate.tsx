import { memo } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { CONTRACT_PLATE } from '../../config/ceremony';
import type { useCeremonyStyles } from '../../hooks/useCeremonyStyles';
import type { EntranceAnim } from '../../hooks/useEntranceSequence';
import { ContractSeal } from './ContractSeal';
import { SignatureName } from './SignatureName';

const FILL = withAlpha(colors.background[700], 0.7);
const STROKE = withAlpha(colors.accent, 0.2);
const LINE = withAlpha(colors.accent, 0.6);

export const ContractPlate = memo(function ContractPlate({
  name,
  anim,
  styles,
}: {
  name: string;
  anim: EntranceAnim;
  styles: ReturnType<typeof useCeremonyStyles>;
}) {
  return (
    <View accessible accessibilityLabel={`Contract signed: ${name}`}>
      <SkewPanel slant={CONTRACT_PLATE.slant} fill={FILL} stroke={STROKE} className="px-8 pb-6 pt-7">
        <Text maxFontSizeMultiplier={1.3} className="text-center font-body-italic text-md text-hint">
          I chooseth this fate of mine own free will.
        </Text>
        <View className="mt-5">
          <SignatureName name={name} anim={anim} />
        </View>
        <View className="mt-2 flex-row items-center">
          <View className="mr-4 h-px flex-1">
            <Animated.View style={[{ flex: 1, backgroundColor: LINE, transformOrigin: 'left center' }, styles.line]} />
          </View>
          <ContractSeal stamp={styles.seal} ripple={styles.sealRipple} label={styles.sealLabel} />
        </View>
      </SkewPanel>
    </View>
  );
});
