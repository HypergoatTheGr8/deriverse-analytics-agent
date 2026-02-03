'use client';

import { useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { PnLChart } from '@/components/PnLChart';
import { TradeHistory } from '@/components/TradeHistory';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { FilterBar } from '@/components/FilterBar';
import { Trade } from '@/types/trade';

// Mock data for testing
const mockTrades: Trade[] = [
  { 
    id: '1', 
    symbol: 'SOL-PERP', 
    action: 'long', 
    size: 10, 
    entryPrice: 95.50, 
    exitPrice: 102.30, 
    fee: 0.85, 
    pnl: 67.15, 
    isLong: true,
    timestamp: Date.now() - 86400000,
    entryTime: Date.now() - 86400000,
    exitTime: Date.now() - 82800000,
    orderType: 'limit'
  },
  { 
    id: '2', 
    symbol: 'BTC-PERP', 
    action: 'short', 
    size: 0.5, 
    entryPrice: 43250, 
    exitPrice: 42800, 
    fee: 2.15, 
    pnl: 222.85, 
    isLong: false,
    timestamp: Date.now() - 172800000,
    entryTime: Date.now() - 172800000,
    exitTime: Date.now() - 169200000,
    orderType: 'market'
  },
  { 
    id: '3', 
    symbol: 'ETH-PERP', 
    action: 'long', 
    size: 2, 
    entryPrice: 2280, 
    exitPrice: 2195, 
    fee: 1.50, 
    pnl: -171.50, 
    isLong: true,
    timestamp: Date.now() - 259200000,
    entryTime: Date.now() - 259200000,
    exitTime: Date.now() - 255600000,
    orderType: 'limit'
  },
];

const mockEquityCurve = [
  { date: '2024-01-01', pnl: 0 },
  { date: '2024-01-02', pnl: 150 },
  { date: '2024-01-03', pnl: 280 },
  { date: '2024-01-04', pnl: 195 },
  { date: '2024-01-05', pnl: 420 },
  { date: '2024-01-06', pnl: 385 },
  { date: '2024-01-07', pnl: 520 },
];

export default function Home() {
  const [filteredTrades, setFilteredTrades] = useState(mockTrades);

  // Calculate metrics
  const totalPnL = filteredTrades.reduce((sum, t) => sum + t.pnl, 0);
  const winningTrades = filteredTrades.filter(t => t.pnl > 0).length;
  const winRate = filteredTrades.length > 0 ? (winningTrades / filteredTrades.length) * 100 : 0;
  const totalFees = filteredTrades.reduce((sum, t) => sum + t.fee, 0);
  const longTrades = filteredTrades.filter(t => t.isLong).length;
  const longRatio = filteredTrades.length > 0 ? (longTrades / filteredTrades.length) * 100 : 0;

  const handleFilter = (symbol: string, dateFrom: string, dateTo: string) => {
    let filtered = mockTrades;
    if (symbol) {
      filtered = filtered.filter(t => t.symbol === symbol);
    }
    setFilteredTrades(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Deriverse Analytics Dashboard</h1>
        <p className="text-gray-400">Professional trading analytics for Solana</p>
      </header>

      {/* Filter Bar */}
      <FilterBar onFilter={handleFilter} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Total PnL" 
          value={`$${totalPnL.toFixed(2)}`} 
          change={totalPnL >= 0 ? '+' : ''} 
        />
        <StatCard 
          label="Win Rate" 
          value={`${winRate.toFixed(1)}%`} 
        />
        <StatCard 
          label="Total Fees" 
          value={`$${totalFees.toFixed(2)}`} 
        />
        <StatCard 
          label="Long/Short Ratio" 
          value={`${longRatio.toFixed(0)}% Long`} 
        />
      </div>

      {/* PnL Chart */}
      <div className="bg-gray-800 rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">Equity Curve</h2>
        <PnLChart data={mockEquityCurve} />
      </div>

      {/* Trade History */}
      <div className="bg-gray-800 rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">Trade History</h2>
        <TradeHistory trades={filteredTrades} />
      </div>

      {/* AI Insights */}
      <AIInsightPanel trades={filteredTrades} metrics={{ pnl: totalPnL, winRate, drawdown: 0.05 }} />
    </div>
  );
}
