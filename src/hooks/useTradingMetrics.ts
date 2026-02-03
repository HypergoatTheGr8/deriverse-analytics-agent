import { Trade } from '../types/trade';
import {
  calculateTotalPnL,
  calculateWinRate,
  calculateMaxDrawdown,
  calculateFeeImpact,
  calculateLongShortRatio,
  calculateAverageTradeDuration,
  calculateLargestGainLoss,
  calculateAverageWinLoss,
  calculateVolumeAnalysis,
} from '../lib/analytics';

export function useTradingMetrics(trades: Trade[], filters?: { symbol?: string; fromDate?: number; toDate?: number }) {
  const filteredTrades = trades.filter(trade => {
    if (filters?.symbol && trade.symbol !== filters.symbol) return false;
    if (filters?.fromDate && trade.entryTime < filters.fromDate) return false;
    if (filters?.toDate && trade.exitTime > filters.toDate) return false;
    return true;
  });

  const equityCurve = filteredTrades.reduce<number[]>(
    (curve, trade, index) => {
      const prevValue = curve[index] || 0;
      return [...curve, prevValue + trade.pnl];
    },
    [0]
  );

  return {
    totalPnL: calculateTotalPnL(filteredTrades),
    winRate: calculateWinRate(filteredTrades),
    maxDrawdown: calculateMaxDrawdown(equityCurve),
    feeImpact: calculateFeeImpact(filteredTrades),
    longShortRatio: calculateLongShortRatio(filteredTrades),
    avgTradeDuration: calculateAverageTradeDuration(filteredTrades),
    largestGainLoss: calculateLargestGainLoss(filteredTrades),
    avgWinLoss: calculateAverageWinLoss(filteredTrades),
    totalVolume: calculateVolumeAnalysis(filteredTrades),
  };
}