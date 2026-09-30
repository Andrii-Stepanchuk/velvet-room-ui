import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { playerRepository } from '../repositories';

export function usePlayer() {
  const { data, error, updatedAt } = useLiveQuery(playerRepository.query());
  if (error) throw error;

  return {
    player: data[0],
    loaded: updatedAt !== undefined,
    saveName: playerRepository.saveName,
    remove: playerRepository.delete,
  };
}
