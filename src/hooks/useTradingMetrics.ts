import { Trade } from '../types/trade';
import {
  calculateTotalPnL,
  calculateWinRate,
  calculateMaxDrawdown,
  calculateFeeImpact,
  calculateFeeComposition,
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

  const totalPnL = calculateTotalPnL(filteredTrades);
  const winRate = calculateWinRate(filteredTrades);
  const maxDrawdown = calculateMaxDrawdown(equityCurve);
  const feeImpact = calculateFeeImpact(filteredTrades);
  const feeComposition = calculateFeeComposition(filteredTrades);
  const longShortRatio = calculateLongShortRatio(filteredTrades);
  const avgTradeDuration = calculateAverageTradeDuration(filteredTrades);
  const largestGainLoss = calculateLargestGainLoss(filteredTrades);
  const avgWinLoss = calculateAverageWinLoss(filteredTrades);
  const totalVolume = calculateVolumeAnalysis(filteredTrades);

  return {
    // keep legacy-friendly names used across the UI
    totalPnL,
    pnl: totalPnL,
    winRate, // fraction 0..1
    maxDrawdown, // fraction 0..1
    drawdown: maxDrawdown,
    feeImpact, // fraction 0..1
    feeComposition,
    longShortRatio, // fraction 0..1
    avgTradeDuration,
    largestGainLoss,
    largestGain: largestGainLoss.largestGain,
    largestLoss: largestGainLoss.largestLoss,
    avgWinLoss,
    totalVolume,
  };
}