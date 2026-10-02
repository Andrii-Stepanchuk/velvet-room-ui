import type { ArcanaId } from './arcanaData';
import { blessingBonus, type BlessingContext } from './blessings';
import type { Boosts } from './boosts';
import { questBaseXp, roundHalfUp } from './questXp';

export interface Award {
  base: number;
  moonMult: number;
  darkHour: boolean;
  fullMoon: boolean;
  arcanaId: ArcanaId;
  blessingPct: number;
  awarded: number;
}

export interface AwardContext extends Omit<BlessingContext, 'boosts'> {
  arcanaId: ArcanaId;
  boosts: Pick<Boosts, 'darkHour' | 'fullMoon' | 'multiplier'>;
}

export function computeAward(ctx: AwardContext): Award {
  const base = questBaseXp(ctx.effort, ctx.challenge);
  const moonMult = ctx.boosts.multiplier;
  const blessingPct = blessingBonus(ctx.arcanaId, ctx);
  const awarded = roundHalfUp(base * moonMult * (1 + blessingPct));
  return {
    base,
    moonMult,
    darkHour: ctx.boosts.darkHour,
    fullMoon: ctx.boosts.fullMoon,
    arcanaId: ctx.arcanaId,
    blessingPct,
    awarded,
  };
}
