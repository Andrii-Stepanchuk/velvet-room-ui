import { memo } from 'react';
import { BookOpenText, Hammer, HandFist, HandHeart, Sparkles, type LucideIcon } from 'lucide-react-native';

import type { StatKey } from '@/lib/game';

const ICONS: Record<StatKey, LucideIcon> = {
  knowledge: BookOpenText,
  guts: HandFist,
  proficiency: Hammer,
  kindness: HandHeart,
  charm: Sparkles,
};

export const StatIcon = memo(function StatIcon({ stat, size, color }: { stat: StatKey; size: number; color: string }) {
  const Icon = ICONS[stat];
  return <Icon size={size} color={color} strokeWidth={1.8} />;
});
