export const STAT_KEYS = ['knowledge', 'guts', 'proficiency', 'kindness', 'charm'] as const;

export type StatKey = (typeof STAT_KEYS)[number];

export interface StatDef {
  key: StatKey;
  name: string;
  ranks: readonly string[];
}

export interface StatProgress {
  key: StatKey;
  level: number;
  xp: number;
  maxXp: number;
}

export const STAT_DEFS: Record<StatKey, StatDef> = {
  knowledge: {
    key: 'knowledge',
    name: 'Knowledge',
    ranks: ['Curious', 'Diligent', 'Studious', 'Scholar', 'Erudite', 'Sage', 'Polymath', 'Luminary'],
  },
  guts: {
    key: 'guts',
    name: 'Guts',
    ranks: ['Nervous', 'Steady', 'Bold', 'Fearless', 'Resolute', 'Unshaken', 'Valiant', 'Indomitable'],
  },
  proficiency: {
    key: 'proficiency',
    name: 'Proficiency',
    ranks: ['Novice', 'Skilled', 'Adept', 'Craftsman', 'Expert', 'Master', 'Virtuoso', 'Grandmaster'],
  },
  kindness: {
    key: 'kindness',
    name: 'Kindness',
    ranks: ['Considerate', 'Warm', 'Caring', 'Generous', 'Selfless', 'Nurturing', 'Devoted', 'Radiant'],
  },
  charm: {
    key: 'charm',
    name: 'Charm',
    ranks: ['Shy', 'Present', 'Poised', 'Magnetic', 'Captivating', 'Charismatic', 'Iconic', 'Legendary'],
  },
};

export function rankName(key: StatKey, level: number): string {
  const { ranks } = STAT_DEFS[key];
  return ranks[Math.min(Math.max(level, 1), ranks.length) - 1];
}
