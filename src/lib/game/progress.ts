export interface OverallProgress {
  level: number;
  xp: number;
  maxXp: number;
}

export interface QuestSummary {
  done: number;
  total: number;
  remaining: number;
}

export function xpToNext({ xp, maxXp }: { xp: number; maxXp: number }): number {
  return Math.max(maxXp - xp, 0);
}

export function xpFraction({ xp, maxXp }: { xp: number; maxXp: number }): number {
  if (maxXp <= 0) return 0;
  return Math.min(Math.max(xp / maxXp, 0), 1);
}

export function summarizeQuests(quests: readonly { done: boolean }[]): QuestSummary {
  const done = quests.filter((q) => q.done).length;
  return { done, total: quests.length, remaining: quests.length - done };
}

export function questMessage(summary: QuestSummary, streak: number): string {
  if (summary.total === 0) return 'No quests set for today.';
  if (summary.remaining === 0) return `All clear — streak ${streak}.`;
  return `Clear ${summary.remaining} more to keep the streak.`;
}
