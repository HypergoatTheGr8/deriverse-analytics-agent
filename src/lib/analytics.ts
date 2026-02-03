import { Trade } from '../types/trade';

export function calculateTotalPnL(trades: Trade[]): number {
  return trades.reduce((sum, trade) => sum + trade.pnl, 0);
}

export function calculateWinRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const profitableTrades = trades.filter(trade => trade.pnl > 0).length;
  return (profitableTrades / trades.length) * 100;
}

export function calculateMaxDrawdown(equityCurve: number[]): number {
  if (equityCurve.length === 0) return 0;
  let peak = equityCurve[0];
  let maxDrawdown = 0;
  for (const value of equityCurve) {
    if (value > peak) peak = value;
    const drawdown = ((peak - value) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  return maxDrawdown;
}

export function calculateFeeImpact(trades: Trade[]): number {
  const totalFees = trades.reduce((sum, trade) => sum + trade.fee, 0);
  const totalProfit = trades.reduce((sum, trade) => sum + (trade.pnl > 0 ? trade.pnl : 0), 0);
  if (totalProfit === 0) return 0;
  return (totalFees / totalProfit) * 100;
}

export function calculateLongShortRatio(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const longTrades = trades.filter(trade => trade.isLong).length;
  return (longTrades / trades.length) * 100;
}

export function calculateAverageTradeDuration(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const totalDuration = trades.reduce((sum, trade) => sum + (trade.exitTime - trade.entryTime), 0);
  return totalDuration / trades.length;
}

export function calculateLargestGainLoss(trades: Trade[]): { largestGain: number, largestLoss: number } {
  let largestGain = 0;
  let largestLoss = 0;
  trades.forEach(trade => {
    if (trade.pnl > largestGain) largestGain = trade.pnl;
    if (trade.pnl < largestLoss) largestLoss = trade.pnl;
  });
  return { largestGain, largestLoss };
}

export function calculateAverageWinLoss(trades: Trade[]): { avgWin: number, avgLoss: number } {
  const wins = trades.filter(trade => trade.pnl > 0);
  const losses = trades.filter(trade => trade.pnl < 0);
  const avgWin = wins.length > 0 ? wins.reduce((sum, trade) => sum + trade.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((sum, trade) => sum + trade.pnl, 0) / losses.length : 0;
  return { avgWin, avgLoss };
}

export function calculateVolumeAnalysis(trades: Trade[]): number {
  return trades.reduce((sum, trade) => sum + trade.size, 0);
}