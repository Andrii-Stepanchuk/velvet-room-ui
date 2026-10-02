export const CONFIG = {
  boosts: {
    darkHour: { startHour: 21, endHour: 24, multiplier: 1.5, earlyStartHour: 20 },
    fullMoonMultiplier: 2,
    cap: 3,
  },
  arcana: {
    worldMinLevel: 7,
    foolMaxSpread: 1,
  },
  quests: {
    effort: { quick: 30, short: 45, session: 65, deep: 90, epic: 140 },
    challenge: { routine: 1, stretch: 1.25, hard: 1.5 },
    roundTo: 5,
    titleMaxLength: 60,
    noteMaxLength: 140,
  },
  curves: {
    stat: { base: 450, growth: 1.5, maxLevel: 8 },
    overall: { base: 200, growth: 1.08, maxLevel: 99 },
  },
  blessings: {
    fortuneOdds: 8,
    chariotStreak: 3,
    temperanceSpread: 2,
    noonHour: 12,
  },
} as const;

export type Config = typeof CONFIG;
