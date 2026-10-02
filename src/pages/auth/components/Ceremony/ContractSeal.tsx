import { memo } from 'react';
import { Text, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';
import { SEAL } from '../../config/ceremony';

type Style = AnimatedStyle<ViewStyle>;

export const ContractSeal = memo(function ContractSeal({
  stamp,
  ripple,
  label,
}: {
  stamp: Style;
  ripple: Style;
  label: Style;
}) {
  return (
    <View className="flex-row items-center">
      <View style={{ width: SEAL.size, height: SEAL.size }} className="items-center justify-center">
        <Animated.View
          style={[
            { position: 'absolute', width: SEAL.size, height: SEAL.size, borderWidth: 1, borderColor: colors.accent },
            ripple,
          ]}
        />
        <Animated.View
          style={[
            {
              width: SEAL.size,
              height: SEAL.size,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
            },
            stamp,
          ]}
        >
          <View style={{ width: SEAL.core, height: SEAL.core, backgroundColor: colors.ink }} />
        </Animated.View>
      </View>
      <Animated.View style={label}>
        <Text maxFontSizeMultiplier={1.15} className="ml-3 font-display-medium text-2xs tracking-lg text-accent">
          SEALED
        </Text>
      </Animated.View>
    </View>
  );
});
