import { Trade } from '@/types/trade';

export function calculateTotalPnL(trades: Trade[]): number {
  return trades.reduce((sum, trade) => sum + trade.pnl, 0);
}

export function calculateWinRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const profitableTrades = trades.filter(trade => trade.pnl > 0).length;
  // Return fraction 0..1
  return profitableTrades / trades.length;
}

export function calculateMaxDrawdown(equityCurve: number[]): number {
  if (equityCurve.length === 0) return 0;
  let peak = equityCurve[0];
  let maxDrawdown = 0;
  for (const value of equityCurve) {
    if (value > peak) peak = value;
    if (peak <= 0) continue; // avoid division by zero or meaningless drawdown when peak <= 0
    const drawdownFraction = (peak - value) / peak; // fraction 0..1
    if (drawdownFraction > maxDrawdown) maxDrawdown = drawdownFraction;
  }
  return maxDrawdown;
}

export function calculateFeeImpact(trades: Trade[]): number {
  const totalFees = trades.reduce((sum, trade) => sum + trade.fee, 0);
  const totalProfit = trades.reduce((sum, trade) => sum + (trade.pnl > 0 ? trade.pnl : 0), 0);
  if (totalProfit === 0) return 0;
  // Return fraction e.g. 0.25 means fees are 25% of profit
  return totalFees / totalProfit;
}

export function calculateFeeComposition(trades: Trade[]): {
  totalFees: number;
  marketOrderFees: number;
  limitOrderFees: number;
  feeBySymbol: Record<string, number>;
  avgFeePerTrade: number;
} {
  const marketOrderTrades = trades.filter(t => t.orderType === 'market');
  const limitOrderTrades = trades.filter(t => t.orderType === 'limit');
  
  const totalFees = trades.reduce((sum, trade) => sum + trade.fee, 0);
  const marketOrderFees = marketOrderTrades.reduce((sum, trade) => sum + trade.fee, 0);
  const limitOrderFees = limitOrderTrades.reduce((sum, trade) => sum + trade.fee, 0);
  
  // Calculate fees by symbol
  const feeBySymbol: Record<string, number> = {};
  trades.forEach(trade => {
    feeBySymbol[trade.symbol] = (feeBySymbol[trade.symbol] || 0) + trade.fee;
  });
  
  const avgFeePerTrade = trades.length > 0 ? totalFees / trades.length : 0;
  
  return {
    totalFees,
    marketOrderFees,
    limitOrderFees,
    feeBySymbol,
    avgFeePerTrade
  };
}

export function calculateLongShortRatio(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const longTrades = trades.filter(trade => trade.isLong).length;
  // Return fraction 0..1
  return longTrades / trades.length;
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