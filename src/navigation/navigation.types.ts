import type { StatKey } from '@/lib/game';

export type RootStackParamList = {
  Register: { replay?: boolean } | undefined;
  Status: undefined;
  Menu: undefined;
  Settings: undefined;
  Stats: undefined;
  StatDetail: { stat: StatKey };
};
