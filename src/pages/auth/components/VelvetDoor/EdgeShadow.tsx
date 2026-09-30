import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';

const EDGE = 22;
const EDGE_DARK = withAlpha(colors.background[900], 0.2);
const EDGE_CLEAR = withAlpha(colors.background[900], 0);

export function EdgeShadow() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[EDGE_DARK, EDGE_CLEAR] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: EDGE }}
      />
      <LinearGradient
        colors={[EDGE_CLEAR, EDGE_DARK] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: EDGE }}
      />
      <LinearGradient
        colors={[EDGE_DARK, EDGE_CLEAR] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: EDGE }}
      />
      <LinearGradient
        colors={[EDGE_CLEAR, EDGE_DARK] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: EDGE }}
      />
    </View>
  );
}
