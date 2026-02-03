export interface Trade {
  timestamp: Date;
  action: 'buy' | 'sell';
  size: number;
  entryPrice: number;
  exitPrice: number;
  fee: number;
  pnl: number;
  isLong: boolean;
}