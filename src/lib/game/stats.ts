export const STAT_KEYS = ['knowledge', 'guts', 'proficiency', 'kindness', 'charm'] as const;

export type StatKey = (typeof STAT_KEYS)[number];

export interface StatDef {
  key: StatKey;
  name: string;
  abbr: string;
  description: string;
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
    abbr: 'KNOW',
    description:
      'Hours of focused study, reading, and problem-solving. Feeds courses, deep work, and language practice.',
    ranks: ['Curious', 'Diligent', 'Studious', 'Scholar', 'Erudite', 'Sage', 'Polymath', 'Luminary'],
  },
  guts: {
    key: 'guts',
    name: 'Guts',
    abbr: 'GUTS',
    description:
      'Facing discomfort on purpose. Feeds hard conversations, cold starts, and showing up when it would be easier not to.',
    ranks: ['Nervous', 'Steady', 'Bold', 'Fearless', 'Resolute', 'Unshaken', 'Valiant', 'Indomitable'],
  },
  proficiency: {
    key: 'proficiency',
    name: 'Proficiency',
    abbr: 'PROF',
    description:
      'Hands-on craft and deliberate practice. Feeds training, building, and the repetitions that turn effort into skill.',
    ranks: ['Novice', 'Skilled', 'Adept', 'Craftsman', 'Expert', 'Master', 'Virtuoso', 'Grandmaster'],
  },
  kindness: {
    key: 'kindness',
    name: 'Kindness',
    abbr: 'KIND',
    description:
      'Care put into action. Feeds helping out, listening closely, and small acts of generosity.',
    ranks: ['Considerate', 'Warm', 'Caring', 'Generous', 'Selfless', 'Nurturing', 'Devoted', 'Radiant'],
  },
  charm: {
    key: 'charm',
    name: 'Charm',
    abbr: 'CHRM',
    description:
      'Presence and connection. Feeds speaking up, meeting new people, and being fully there.',
    ranks: ['Shy', 'Present', 'Poised', 'Magnetic', 'Captivating', 'Charismatic', 'Iconic', 'Legendary'],
  },
};

export function rankName(key: StatKey, level: number): string {
  const { ranks } = STAT_DEFS[key];
  return ranks[Math.min(Math.max(level, 1), ranks.length) - 1];
}

export type RankState = 'done' | 'current' | 'locked';

export interface RankStep {
  rank: number;
  name: string;
  state: RankState;
}

export function rankPath({ key, level }: StatProgress): RankStep[] {
  const { ranks } = STAT_DEFS[key];
  const current = Math.min(Math.max(level, 1), ranks.length);
  return ranks.map((name, index) => {
    const rank = index + 1;
    const state: RankState = rank < current ? 'done' : rank === current ? 'current' : 'locked';
    return { rank, name, state };
  });
}

export function nextRankName({ key, level }: StatProgress): string | null {
  const { ranks } = STAT_DEFS[key];
  return level >= 1 && level < ranks.length ? ranks[level] : null;
}
