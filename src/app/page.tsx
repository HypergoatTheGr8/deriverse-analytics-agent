'use client';

import { useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { PnLChart } from '@/components/PnLChart';
import { TradeHistory } from '@/components/TradeHistory';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { FilterBar } from '@/components/FilterBar';
import { TimeAnalysis } from '@/components/TimeAnalysis';
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
  { date: '2024-01-01', pnl: 0, drawdown: 0 },
  { date: '2024-01-02', pnl: 150, drawdown: 0 },
  { date: '2024-01-03', pnl: 280, drawdown: 0 },
  { date: '2024-01-04', pnl: 195, drawdown: -85 },
  { date: '2024-01-05', pnl: 420, drawdown: 0 },
  { date: '2024-01-06', pnl: 385, drawdown: -35 },
  { date: '2024-01-07', pnl: 520, drawdown: 0 },
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
  
  // Additional metrics
  const avgDuration = filteredTrades.length > 0 
    ? filteredTrades.reduce((sum, t) => sum + (t.exitTime - t.entryTime), 0) / filteredTrades.length / 3600000 
    : 0;
  const bestTrade = Math.max(...filteredTrades.map(t => t.pnl));
  const worstTrade = Math.min(...filteredTrades.map(t => t.pnl));
  const totalVolume = filteredTrades.reduce((sum, t) => sum + (t.size * t.entryPrice), 0);

  const handleFilter = (symbol: string, dateFrom: string, dateTo: string) => {
    let filtered = mockTrades;
    if (symbol) {
      filtered = filtered.filter(t => t.symbol === symbol);
    }
    setFilteredTrades(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with gradient */}
      <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-gray-900 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Deriverse Analytics Dashboard</h1>
            <p className="text-gray-400">Professional trading analytics for Solana</p>
          </div>
          <button 
            onClick={() => alert('Wallet connection coming soon!')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-2 rounded-lg font-medium transition-all hover:scale-105"
          >
            Connect Wallet
          </button>
        </div>
      </header>

      <div className="px-6">
        {/* Filter Bar */}
        <FilterBar onFilter={handleFilter} />

        {/* Stats Grid - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard 
            label="Total PnL" 
            value={`$${totalPnL.toFixed(2)}`} 
            isPositive={totalPnL >= 0}
          />
          <StatCard 
            label="Win Rate" 
            value={`${winRate.toFixed(1)}%`}
            isPositive={winRate >= 50} 
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

        {/* Stats Grid - Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Avg Duration" 
            value={`${avgDuration.toFixed(1)}h`} 
          />
          <StatCard 
            label="Best Trade" 
            value={`+$${bestTrade.toFixed(2)}`}
            isPositive={true} 
          />
          <StatCard 
            label="Worst Trade" 
            value={`$${worstTrade.toFixed(2)}`}
            isPositive={false} 
          />
          <StatCard 
            label="Total Volume" 
            value={`$${totalVolume.toLocaleString()}`} 
          />
        </div>

        {/* PnL Chart */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">Equity Curve & Drawdown</h2>
          <PnLChart data={mockEquityCurve} />
        </div>

        {/* Time Analysis */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">Performance by Time</h2>
          <TimeAnalysis trades={filteredTrades} />
        </div>

        {/* Trade History */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">Trade History</h2>
          <TradeHistory trades={filteredTrades} />
        </div>

        {/* AI Insights */}
        <AIInsightPanel trades={filteredTrades} metrics={{ pnl: totalPnL, winRate, drawdown: 0.05 }} />
      </div>
    </div>
  );
}
