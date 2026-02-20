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
  // Total profit/loss in USD (or account currency)
  pnl: number;
  // Alias for `pnl` kept for backwards compatibility
  totalPnL?: number;

  // Fractional win rate (0..1)
  winRate: number;

  // Max drawdown as a fraction (0..1). Also provided as `maxDrawdown` alias.
  drawdown: number;
  maxDrawdown?: number;

  // Fractional fee impact relative to profits (0..1)
  feeImpact?: number;

  // Detailed fee composition breakdown
  feeComposition?: {
    totalFees: number;
    marketOrderFees: number;
    limitOrderFees: number;
    feeBySymbol: Record<string, number>;
    avgFeePerTrade: number;
  };

  // Fraction of trades that are long (0..1)
  longShortRatio?: number;

  // Average trade duration in milliseconds
  avgTradeDuration?: number;

  // Aggregate largest gain / loss numbers and convenient aliases
  largestGainLoss?: { largestGain: number; largestLoss: number };
  largestGain?: number;
  largestLoss?: number;

  // Average win / loss values
  avgWinLoss?: { avgWin: number; avgLoss: number };
  avgWin?: number;
  avgLoss?: number;

  // Total traded volume (sum of `size`)
  totalVolume?: number;
}
