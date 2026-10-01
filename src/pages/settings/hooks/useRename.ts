import { useCallback, useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { usePlayer } from '@/lib/data/hooks';

export function useRename() {
  const { player, saveName } = usePlayer();
  const current = player?.name ?? '';
  const [value, setValue] = useState(current);

  useEffect(() => setValue(current), [current]);

  const name = value.trim();
  const canSave = name.length > 0 && name !== current;
  const save = useCallback(() => {
    if (!canSave) return;
    saveName(name);
    Keyboard.dismiss();
  }, [canSave, name, saveName]);

  return { value, setValue, canSave, save };
}
