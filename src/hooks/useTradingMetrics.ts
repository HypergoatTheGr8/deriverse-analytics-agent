import { Trade } from '../types/trade';
import {
  calculateTotalPnL,
  calculateWinRate,
  calculateMaxDrawdown,
  calculateFeeImpact,
  calculateLongShortRatio,
} from '../lib/analytics';

export function useTradingMetrics(trades: Trade[]) {
  const equityCurve = trades.reduce<number[]>(
    (curve, trade, index) => {
      const prevValue = curve[index] || 0;
      return [...curve, prevValue + trade.pnl];
    },
    [0]
  );

  return {
    totalPnL: calculateTotalPnL(trades),
    winRate: calculateWinRate(trades),
    maxDrawdown: calculateMaxDrawdown(equityCurve),
    feeImpact: calculateFeeImpact(trades),
    longShortRatio: calculateLongShortRatio(trades),
  };
}