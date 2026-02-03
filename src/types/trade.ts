export interface Trade {
  id: string;
  symbol: string;
  action: string;
  size: number;
  entryPrice: number;
  exitPrice: number;
  fee: number;
  pnl: number;
  isLong: boolean;
  timestamp: number;
  entryTime: number;
  exitTime: number;
  orderType: 'market' | 'limit';
}

export interface TradingMetrics {
  pnl: number;
  winRate: number;
  drawdown: number;
  feeImpact?: number;
  longShortRatio?: number;
  avgTradeDuration?: number;
  largestGain?: number;
  largestLoss?: number;
}
