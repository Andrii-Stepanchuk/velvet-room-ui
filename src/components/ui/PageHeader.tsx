import { memo } from 'react';
import { Text, View } from 'react-native';

import { formatDayLabel } from '@/lib/format';
import { skewX, textShade } from '@/lib/style';

const TITLE_STYLE = [skewX(-6), textShade, { lineHeight: 40 }];

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
      <Text className="font-display text-sm tracking-md text-white" style={textShade}>
        {formatDayLabel(date)}
      </Text>
      <Text className="mt-1 font-display-italic text-2xl text-white" style={TITLE_STYLE}>
        {title}
      </Text>
      {subtitle && (
        <Text className="mt-1.5 font-display text-sm tracking-sm text-primary" style={textShade}>
          {subtitle}
        </Text>
      )}
    </View>
  );
});
