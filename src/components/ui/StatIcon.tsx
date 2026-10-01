import { memo } from 'react';
import type { LucideIcon } from 'lucide-react-native';
import BookOpenText from 'lucide-react-native/icons/book-open-text';
import Hammer from 'lucide-react-native/icons/hammer';
import HandFist from 'lucide-react-native/icons/hand-fist';
import HandHeart from 'lucide-react-native/icons/hand-heart';
import Sparkles from 'lucide-react-native/icons/sparkles';

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
