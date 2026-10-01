import { deriveArcana } from '@/lib/game';
import { SEED_OVERALL, SEED_QUESTS, SEED_STATS, SEED_STREAK } from '../seed';

const SEED_PROGRESS = {
  stats: SEED_STATS,
  overall: SEED_OVERALL,
  quests: SEED_QUESTS,
  streak: SEED_STREAK,
  arcana: deriveArcana(SEED_STATS),
};

export function useProgress() {
  return SEED_PROGRESS;
}
