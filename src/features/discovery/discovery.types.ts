export type CosybeeDevice = {
  name: string;
  host: string;
  port: number;
  ip?: string;
  txt?: Record<string, string>;
  id?: string;
  lastSeen?: number;
};
