import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius } from '@/constants/theme';
import { glowShadow, withAlpha } from '@/lib/style';
import { EdgeShadow } from './EdgeShadow';

const HANDLE_H = 34;
const HANDLE_TOP = 165;
const DOOR_FILL = ['#0e2260', '#091748', '#071232'] as const;
const HANDLE_FILL = ['#bfe9ff', '#5a8fe0'] as const;
const HANDLE_GLOW = glowShadow(colors.accent, { opacity: 0.6, radius: 10, elevation: 4 });

export function DoorHalf({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left';
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderTopLeftRadius: isLeft ? radius.sm : 0,
        borderBottomLeftRadius: isLeft ? radius.sm : 0,
        borderTopRightRadius: isLeft ? 0 : radius.sm,
        borderBottomRightRadius: isLeft ? 0 : radius.sm,
        ...(isLeft
          ? { borderRightWidth: 1, borderRightColor: withAlpha(colors.accent, 0.35) }
          : { borderLeftWidth: 1, borderLeftColor: withAlpha(colors.accent, 0.35) }),
      }}
    >
      <LinearGradient
        colors={DOOR_FILL}
        locations={[0, 0.58, 1]}
        start={{ x: isLeft ? 0 : 1, y: 0 }}
        end={{ x: isLeft ? 1 : 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <EdgeShadow />
      <View
        style={[
          {
            position: 'absolute',
            top: 9,
            bottom: 9,
            borderWidth: 1,
            borderColor: withAlpha(colors.accent, 0.3),
            borderTopLeftRadius: isLeft ? 3 : 0,
            borderBottomLeftRadius: isLeft ? 3 : 0,
            borderTopRightRadius: isLeft ? 0 : 3,
            borderBottomRightRadius: isLeft ? 0 : 3,
          },
          isLeft ? { left: 9, right: 5 } : { left: 5, right: 9 },
        ]}
      />
      <LinearGradient
        colors={HANDLE_FILL}
        style={[
          {
            position: 'absolute',
            top: HANDLE_TOP,
            width: 7,
            height: HANDLE_H,
            borderRadius: radius.sm,
            ...HANDLE_GLOW,
          },
          isLeft ? { right: 9 } : { left: 9 },
        ]}
      />
    </View>
  );
}
