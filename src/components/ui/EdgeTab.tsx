import { memo, type ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

import { EDGE_TAB_HEIGHT, EDGE_TAB_SLANT, PAGE_PADDING_X } from '@/constants/layout';
import { slantOffset } from '@/lib/style';
import { SkewPanel } from './SkewPanel';

const SLANT_OFFSET = slantOffset(EDGE_TAB_HEIGHT, EDGE_TAB_SLANT);
const BLEED = PAGE_PADDING_X + SLANT_OFFSET;
const INNER = SLANT_OFFSET + 16;

const SIDE_STYLE: Record<'left' | 'right', ViewStyle> = {
  left: { height: EDGE_TAB_HEIGHT, marginLeft: -BLEED, paddingLeft: BLEED, paddingRight: INNER },
  right: { height: EDGE_TAB_HEIGHT, marginRight: -BLEED, paddingRight: BLEED, paddingLeft: INNER },
};

export const EdgeTab = memo(function EdgeTab({
  side,
  fill,
  stroke,
  shadow,
  children,
}: {
  side: 'left' | 'right';
  fill: string;
  stroke?: string;
  shadow?: string;
  children?: ReactNode;
}) {
  return (
    <SkewPanel
      slant={EDGE_TAB_SLANT}
      fill={fill}
      stroke={stroke}
      shadow={shadow}
      className="flex-row items-center"
      style={SIDE_STYLE[side]}
    >
      {children}
    </SkewPanel>
  );
});
