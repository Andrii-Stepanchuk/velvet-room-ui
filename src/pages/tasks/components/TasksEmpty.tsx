import { memo } from 'react';
import { Text, View } from 'react-native';

import { ActionPlate } from '@/components/ui';
import { textShade } from '@/lib/style';

export type EmptyKind = 'fresh' | 'filtered' | 'quiet';

const COPY: Record<EmptyKind, { flavor: string; help: string }> = {
  fresh: {
    flavor: 'The room is quiet. Forge your first quest.',
    help: 'Name a real action, pick the stat it grows, and the Rulebook sets its XP.',
  },
  filtered: { flavor: 'Nothing answers these filters.', help: 'Clear them to see every quest on this day.' },
  quiet: { flavor: 'Nothing is set for this day.', help: 'Add a quest, or rest. A day with nothing on it never breaks the streak.' },
};

export const TasksEmpty = memo(function TasksEmpty({ kind, onReset }: { kind: EmptyKind; onReset: () => void }) {
  const copy = COPY[kind];
  return (
    <View className="mt-10 px-2">
      <Text className="font-body-italic text-md text-hint" style={textShade}>
        {copy.flavor}
      </Text>
      <Text className="mt-2 font-body-medium text-sm text-secondary" style={textShade}>
        {copy.help}
      </Text>
      {kind === 'filtered' && (
        <View className="mt-5">
          <ActionPlate label="RESET FILTERS" chevron onPress={onReset} />
        </View>
      )}
    </View>
  );
});
