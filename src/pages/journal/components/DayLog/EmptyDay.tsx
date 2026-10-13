import { memo } from 'react';
import { Text } from 'react-native';

import { textShade } from '@/lib/style';
import { DAY_LOG } from '../../config/dayLogLayout';

export const EmptyDay = memo(function EmptyDay({ isToday }: { isToday: boolean }) {
  return (
    <Text maxFontSizeMultiplier={DAY_LOG.maxFontScale} className="font-body-italic text-md text-hint" style={textShade}>
      {isToday ? 'Nothing cleared yet. The night is still yours.' : 'The page is blank. The moon kept watch.'}
    </Text>
  );
});
