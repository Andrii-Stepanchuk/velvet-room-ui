import { memo } from 'react';
import { Text, View } from 'react-native';

import { formatDayLabel } from '@/lib/format';
import { skewX, textGlow } from '@/lib/style';

const TITLE_STYLE = [skewX(-6), textGlow];

export const PageHeader = memo(function PageHeader({
  date,
  title,
  subtitle,
}: {
  date: Date;
  title: string;
  subtitle?: string;
}) {
  return (
    <View>
      <Text className="font-display-medium text-xs tracking-lg text-secondary">{formatDayLabel(date)}</Text>
      <Text className="mt-1 font-display-italic text-2xl text-white" style={TITLE_STYLE}>
        {title}
      </Text>
      {subtitle && <Text className="mt-0.5 font-display-medium text-2xs tracking-md text-accent">{subtitle}</Text>}
    </View>
  );
});
