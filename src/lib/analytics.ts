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