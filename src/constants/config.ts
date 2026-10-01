export const CONFIG = {
  boosts: {
    darkHour: { startHour: 21, endHour: 24, multiplier: 1.5 },
    fullMoonMultiplier: 2,
    cap: 3,
  },
  arcana: {
    worldMinLevel: 7,
    foolMaxSpread: 1,
  },
} as const;

export type Config = typeof CONFIG;
