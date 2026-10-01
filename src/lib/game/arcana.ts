import { CONFIG } from '@/constants/config';
import { ARCANA, type Arcana, type ArcanaId } from './arcanaData';
import { STAT_DEFS, STAT_KEYS, type StatProgress } from './stats';

function byStrength(a: StatProgress, b: StatProgress): number {
  return (
    b.level - a.level ||
    b.xp / b.maxXp - a.xp / a.maxXp ||
    STAT_KEYS.indexOf(a.key) - STAT_KEYS.indexOf(b.key)
  );
}

export function arcanaById(id: ArcanaId): Arcana {
  const arcana = ARCANA.find((a) => a.id === id);
  if (!arcana) throw new Error(`Unknown arcana ${id}`);
  return arcana;
}

export function deriveArcana(stats: readonly StatProgress[]): Arcana {
  const { worldMinLevel, foolMaxSpread } = CONFIG.arcana;
  const levels = stats.map((s) => s.level);
  if (levels.every((level) => level >= worldMinLevel)) return arcanaById('world');
  if (Math.max(...levels) - Math.min(...levels) <= foolMaxSpread) return arcanaById('fool');

  const [first, second] = [...stats].sort(byStrength);
  const match = ARCANA.find((a) => a.stats !== null && a.stats[0] === first.key && a.stats[1] === second.key);
  if (!match) throw new Error(`No arcana for ${first.key} → ${second.key}`);
  return match;
}

export function arcanaFormula(arcana: Arcana): string {
  if (arcana.stats) return `${STAT_DEFS[arcana.stats[0]].name} ▸ ${STAT_DEFS[arcana.stats[1]].name}`;
  if (arcana.id === 'world') return `Every stat at level ${CONFIG.arcana.worldMinLevel}+`;
  return `All stats within ${CONFIG.arcana.foolMaxSpread} level`;
}
