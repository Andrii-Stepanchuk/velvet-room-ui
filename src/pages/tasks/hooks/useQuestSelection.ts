import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export function useQuestSelection() {
  const [ids, setIds] = useState<ReadonlySet<number>>(new Set());
  const [active, setActive] = useState(false);

  const start = useCallback((id: number) => {
    setActive(true);
    setIds(new Set([id]));
  }, []);

  const toggle = useCallback((id: number) => {
    setIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const cancel = useCallback(() => {
    setActive(false);
    setIds(new Set());
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!active) return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        cancel();
        return true;
      });
      return () => sub.remove();
    }, [active, cancel]),
  );

  return { active, ids, start, toggle, cancel };
}
