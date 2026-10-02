import { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SkewPanel } from '@/components/ui';
import { colors } from '@/constants/theme';
import { STAT_DEFS } from '@/lib/game';
import { slantOffset, withAlpha } from '@/lib/style';
import { QUEST_ROW, QUEST_ROW_PAD } from '../../config/tasksLayout';
import type { Readout } from '../../hooks/useClearFeedback';
import type { TaskItem } from '../../hooks/useTaskList';
import { CheckPlate } from './CheckPlate';
import { StatTag } from './StatTag';
import { XpReadout } from './XpReadout';
import { XpValue } from './XpValue';

const FILL = withAlpha(colors.background[700], 0.7);
const FILL_PRESSED = withAlpha(colors.background[700], 0.9);
const FILL_SELECTED = withAlpha(colors.background[400], 0.9);
const STROKE = withAlpha(colors.accent, 0.2);
const STROKE_SELECTED = withAlpha(colors.accent, 0.8);
const PLATE_STYLE = {
  minHeight: QUEST_ROW.minHeight,
  paddingLeft: QUEST_ROW_PAD.left,
  paddingRight: QUEST_ROW_PAD.right,
  paddingVertical: QUEST_ROW.padY,
};
const STRIKE = { textDecorationLine: 'line-through' } as const;
const SELECT_EDGE = withAlpha(colors.accent, 0.8);
const EDGE_STYLE = { position: 'absolute', top: 0, height: 2, left: slantOffset(QUEST_ROW.minHeight, QUEST_ROW.slant), right: 0 } as const;

export const QuestRow = memo(function QuestRow({
  item,
  selecting,
  selected,
  readout,
  onCheck,
  onOpen,
  onSelect,
  onStartSelect,
  onReadoutDone,
}: {
  item: TaskItem;
  selecting: boolean;
  selected: boolean;
  readout: Readout | undefined;
  onCheck: (item: TaskItem) => void;
  onOpen: (item: TaskItem) => void;
  onSelect: (id: number) => void;
  onStartSelect: (id: number) => void;
  onReadoutDone: (id: number) => void;
}) {
  const { quest, done } = item;
  const hue = colors.stat[quest.stat];
  const stat = STAT_DEFS[quest.stat].name;
  const press = useCallback(() => (selecting ? onSelect(quest.id) : onOpen(item)), [selecting, onSelect, onOpen, item, quest.id]);
  const longPress = useCallback(() => (selecting ? onSelect(quest.id) : onStartSelect(quest.id)), [selecting, onSelect, onStartSelect, quest.id]);
  const check = useCallback(() => (selecting ? onSelect(quest.id) : onCheck(item)), [selecting, onSelect, onCheck, item, quest.id]);
  const readoutDone = useCallback(() => onReadoutDone(quest.id), [onReadoutDone, quest.id]);

  const checkLabel = selecting ? `Select ${quest.title}` : `${quest.title}, ${stat}, ${item.xp} XP`;
  const checkHint = selecting
    ? undefined
    : done
      ? item.undoable
        ? `Undo. Removes ${item.xp} XP.`
        : undefined
      : item.clearable
        ? `Clears the quest for ${item.xp} XP.`
        : 'Can be cleared on its day.';

  return (
    <Pressable
      onPress={press}
      onLongPress={longPress}
      delayLongPress={320}
      accessibilityRole="button"
      accessibilityLabel={`${quest.title}. ${stat}. ${done ? 'Cleared' : 'Open'}. ${item.xp} XP${item.meta ? `. ${item.meta}` : ''}`}
      accessibilityHint={selecting ? 'Toggles selection' : 'Opens the quest. Long press to select several.'}
      accessibilityState={selecting ? { selected } : undefined}
    >
      {({ pressed }) => (
        <SkewPanel
          slant={QUEST_ROW.slant}
          fill={selected ? FILL_SELECTED : pressed ? FILL_PRESSED : FILL}
          stroke={selected ? STROKE_SELECTED : done ? withAlpha(hue, 0.35) : STROKE}
          className="flex-row items-center"
          style={PLATE_STYLE}
        >
          {selected && <View pointerEvents="none" style={[EDGE_STYLE, { backgroundColor: SELECT_EDGE }]} />}
          <CheckPlate
            checked={done}
            hue={hue}
            disabled={!selecting && !(item.clearable || item.undoable)}
            onPress={check}
            accessibilityLabel={checkLabel}
            role={selecting ? 'none' : 'checkbox'}
            accessibilityHint={checkHint}
          />
          <View className="flex-1" style={{ marginLeft: QUEST_ROW.gap }}>
            <Text
              numberOfLines={2}
              maxFontSizeMultiplier={QUEST_ROW.maxFontScale}
              className={`font-body-medium text-md ${done ? 'text-tertiary' : 'text-primary'}`}
              style={done ? STRIKE : undefined}
            >
              {quest.title}
            </Text>
            <View className={`mt-1.5 flex-row flex-wrap items-center gap-y-1 ${done ? 'opacity-70' : ''}`}>
              <StatTag stat={quest.stat} />
              <XpValue stat={quest.stat} xp={item.xp} moonMult={item.moonMult} blessed={item.blessed} />
              {item.meta !== '' && (
                <Text
                  maxFontSizeMultiplier={QUEST_ROW.maxFontScale}
                  className="ml-auto pl-3 font-display-medium text-2xs tracking-sm text-tertiary"
                >
                  {item.meta}
                </Text>
              )}
            </View>
          </View>
          {readout && <XpReadout readout={readout} onDone={readoutDone} />}
        </SkewPanel>
      )}
    </Pressable>
  );
});
