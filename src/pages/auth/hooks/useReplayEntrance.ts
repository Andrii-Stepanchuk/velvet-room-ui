import { useEffect, useRef } from 'react';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { usePlayer } from '@/lib/data/hooks';
import type { RootStackParamList } from '@/navigation/navigation.types';

export function useReplayEntrance(begin: (name: string) => void): boolean {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Register'>>();
  const replay = params?.replay === true;
  const { player } = usePlayer();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!replay || !player || startedRef.current) return;
    startedRef.current = true;
    begin(player.name);
  }, [replay, player, begin]);

  return replay;
}
