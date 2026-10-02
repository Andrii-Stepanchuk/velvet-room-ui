import type { Challenge, Effort, StatKey } from '@/lib/game';

export interface DemoQuest {
  title: string;
  stat: StatKey;
  effort: Effort;
  challenge: Challenge;
  repeat: 'daily';
}

export const DEMO_QUESTS: readonly DemoQuest[] = [
  { title: 'Deep work block — 90 min', stat: 'knowledge', effort: 'session', challenge: 'stretch', repeat: 'daily' },
  { title: 'Read 20 pages', stat: 'knowledge', effort: 'short', challenge: 'routine', repeat: 'daily' },
  { title: 'Morning cold shower', stat: 'guts', effort: 'quick', challenge: 'hard', repeat: 'daily' },
  { title: 'Gym — pull day', stat: 'proficiency', effort: 'session', challenge: 'routine', repeat: 'daily' },
  { title: 'Call a friend to check in', stat: 'kindness', effort: 'short', challenge: 'routine', repeat: 'daily' },
  { title: 'Introduce yourself to someone new', stat: 'charm', effort: 'quick', challenge: 'hard', repeat: 'daily' },
];
