import { memo, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { skewX, textShade } from '@/lib/style';
import { DateTab } from './DateTab';

const TITLE_STYLE = [skewX(-6), textShade, { lineHeight: 40 }];

export const PageHeader = memo(function PageHeader({
  date,
  title,
  aside,
}: {
  date: Date;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <View>
      <View className="flex-row">
        <DateTab date={date} />
      </View>
      <View className="mt-4 flex-row items-center justify-between">
        <Text className="font-display-italic text-2xl text-white" style={TITLE_STYLE}>
          {title}
        </Text>
        {aside}
      </View>
    </View>
  );
});
