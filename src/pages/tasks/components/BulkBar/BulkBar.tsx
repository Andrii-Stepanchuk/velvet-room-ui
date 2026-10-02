import { memo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import type { DayKey } from '@/lib/game';
import { textShade, withAlpha } from '@/lib/style';
import { BULK_BAR } from '../../config/tasksLayout';
import { DateStrip } from '../DateStrip';
import { BulkAction } from './BulkAction';

const FILL = withAlpha(colors.background[700], 0.94);
const STROKE = withAlpha(colors.accent, 0.3);
const CANCEL_HIT = { top: 12, bottom: 12, left: 12, right: 12 };

export const BulkBar = memo(function BulkBar({
  count,
  clearable,
  movable,
  today,
  onClear,
  onMove,
  onDelete,
  onCancel,
}: {
  count: number;
  clearable: number;
  movable: number;
  today: DayKey;
  onClear: () => void;
  onMove: (day: DayKey) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const [moving, setMoving] = useState(false);
  return (
    <SkewPanel
      slant={BULK_BAR.slant}
      fill={FILL}
      stroke={STROKE}
      style={{ paddingHorizontal: BULK_BAR.padX, paddingVertical: BULK_BAR.padY }}
    >
      <View className="flex-row items-center justify-between">
        <Text accessibilityLiveRegion="polite" className="font-display text-sm tracking-md text-primary">
          {count} SELECTED
        </Text>
        <Pressable
          onPress={moving ? () => setMoving(false) : onCancel}
          hitSlop={CANCEL_HIT}
          accessibilityRole="button"
          accessibilityLabel={moving ? 'Back to actions' : 'Cancel selection'}
        >
          <Text className="font-display text-sm tracking-md text-secondary">{moving ? 'BACK' : 'CANCEL'}</Text>
        </Pressable>
      </View>
      {moving ? (
        <View className="mt-3">
          <Text className="mb-2 font-display-medium text-2xs tracking-md text-accent">MOVE TO</Text>
          <DateStrip
            today={today}
            selected={null}
            bleed={BULK_BAR.padX}
            onSelect={(day) => {
              setMoving(false);
              onMove(day);
            }}
          />
          {movable < count && (
            <Text className="mt-2 font-body-medium text-xs text-secondary" style={textShade}>
              Repeating quests keep their days; {movable} of {count} will move.
            </Text>
          )}
        </View>
      ) : (
        <View className="mt-3 flex-row gap-2">
          <BulkAction label="CLEAR ▸" primary disabled={clearable === 0} onPress={onClear} />
          <BulkAction label="MOVE" disabled={movable === 0} onPress={() => setMoving(true)} />
          <BulkAction label="DELETE" danger disabled={count === 0} onPress={onDelete} accessibilityHint="Asks for confirmation" />
        </View>
      )}
      {!moving && count > 0 && (movable === 0 || clearable === 0) && (
        <Text className="mt-2 font-body-medium text-xs text-secondary">
          {[movable === 0 ? 'Repeating quests stay on their days.' : null, clearable === 0 ? 'Nothing selected can be cleared today.' : null]
            .filter(Boolean)
            .join(' ')}
        </Text>
      )}
    </SkewPanel>
  );
});
