import { memo } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { SoftGlow } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useLayoutSize } from '@/hooks/useLayoutSize';
import { textGlow } from '@/lib/style';
import { SIGNATURE } from '../../config/ceremony';
import { signatureFontSize, useSignatureWipe } from '../../hooks/useCeremonyStyles';
import type { EntranceAnim } from '../../hooks/useEntranceSequence';

export const SignatureName = memo(function SignatureName({ name, anim }: { name: string; anim: EntranceAnim }) {
  const row = useLayoutSize();
  const ink = useLayoutSize();
  const wipe = useSignatureWipe(anim, ink.size.width);
  const fontSize = signatureFontSize(name, row.size.width);
  const label = name.toUpperCase();

  return (
    <View onLayout={row.onLayout} className="items-center">
      <View onLayout={ink.onLayout} style={{ paddingHorizontal: SIGNATURE.sidePad }}>
        <Animated.View style={[{ overflow: 'hidden' }, wipe.clip]}>
          <Animated.View style={wipe.content}>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1}
              className="font-display-italic text-white"
              style={[{ fontSize, lineHeight: fontSize * 1.15, paddingHorizontal: SIGNATURE.sidePad }, textGlow]}
            >
              {label}
            </Text>
          </Animated.View>
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: 0,
              top: (fontSize * 1.15 - SIGNATURE.nib) / 2,
              width: SIGNATURE.nib,
              height: SIGNATURE.nib,
            },
            wipe.nib,
          ]}
        >
          <SoftGlow width={SIGNATURE.nib} height={SIGNATURE.nib} color={colors.accent} opacity={0.95} />
        </Animated.View>
      </View>
    </View>
  );
});
