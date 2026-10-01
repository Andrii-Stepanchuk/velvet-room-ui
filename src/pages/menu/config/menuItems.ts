export type MenuTarget = 'Status' | 'Settings';

export interface MenuItem {
  key: string;
  label: string;
  subtitle: string;
  target: MenuTarget | null;
}

export const MENU_ITEMS: readonly MenuItem[] = [
  { key: 'status', label: 'STATUS', subtitle: 'Current state & moon', target: 'Status' },
  { key: 'tasks', label: 'TASKS', subtitle: "Today's quests", target: null },
  { key: 'stats', label: 'STATS', subtitle: 'Life stats & ranks', target: null },
  { key: 'bonds', label: 'BONDS', subtitle: 'Your social links', target: null },
  { key: 'journal', label: 'JOURNAL', subtitle: 'History & streak', target: null },
  { key: 'settings', label: 'SETTINGS', subtitle: 'Profile & boosts', target: 'Settings' },
];

export const SEALED_SUBTITLE = 'Sealed — not yet unlocked';
