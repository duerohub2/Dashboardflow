export type Account = {
  id: string;
  name: string;
  url: string;
  limit: number;
  credits: number;
  resetHour: number;
  creditDate: string;
  lastUsed: number | null;
  createdAt: number;
};

export type PendingLaunch = {
  id: string;
  since: number;
} | null;
