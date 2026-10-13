import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import { withAlpha } from '@/lib/style';
import { DAY_LOG } from '../../config/dayLogLayout';

const LINE = withAlpha(colors.accent, 0.2);

export const TimelineRail = memo(function TimelineRail({ color, last, nodeTop }: { color: string; last: boolean; nodeTop: number }) {
  return (
    <View style={css.rail}>
      {!last && <View style={[css.line, { top: nodeTop + DAY_LOG.node / 2 }]} />}
      <View style={[css.node, { top: nodeTop, backgroundColor: color }]} />
    </View>
  );
});

const css = StyleSheet.create({
  rail: { width: DAY_LOG.rail, alignSelf: 'stretch' },
  line: {
    position: 'absolute',
    left: DAY_LOG.node / 2 - 0.5,
    width: 1,
    bottom: -DAY_LOG.rowGap,
    backgroundColor: LINE,
  },
  node: {
    position: 'absolute',
    left: 0,
    width: DAY_LOG.node,
    height: DAY_LOG.node,
    transform: [{ rotate: '45deg' }],
  },
});
