'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import StatCard from './StatCard';
import PnLChart from './PnLChart';
import { TimeAnalysis } from './TimeAnalysis';
import { TradeHistory } from './TradeHistory';
import { AIInsightPanel } from './AIInsightPanel';
import FilterBar from './FilterBar';
// Mock data for demo - in production would use Helius API
import { useTradingMetrics } from '@/hooks/useTradingMetrics';
import { Trade } from '@/types/trade';

export default function Dashboard() {
  const { publicKey } = useWallet();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{ symbol?: string; fromDate?: number; toDate?: number }>({});

  useEffect(() => {
    if (publicKey) {
      loadTrades();
    }
  }, [publicKey]);

  useEffect(() => {
    // Apply filters
    const filtered = trades.filter(trade => {
      if (filters.symbol && trade.symbol !== filters.symbol) return false;
      if (filters.fromDate && trade.entryTime < filters.fromDate) return false;
      if (filters.toDate && trade.exitTime > filters.toDate) return false;
      return true;
    });
    setFilteredTrades(filtered);
  }, [trades, filters]);

  const loadTrades = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      // For demo purposes, use mock data
      // In production, this would call Helius API
      setTrades(generateMockTrades());
    } catch (error) {
      console.error('Failed to load trades:', error);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTrades = (): Trade[] => {
    const symbols = ['SOL/USDC', 'BTC/USDC', 'ETH/USDC', 'RAY/USDC'];
    const trades: Trade[] = [];
    const now = Date.now();
    
    for (let i = 0; i < 50; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const entryTime = now - (i * 86400000); // Spread over days
      const exitTime = entryTime + (Math.random() * 3600000) + 300000; // 5 min to 1 hour
      const entryPrice = 100 + Math.random() * 50;
      const exitPrice = entryPrice + (Math.random() * 40 - 20);
      const size = Math.random() * 10 + 1;
      const pnl = (exitPrice - entryPrice) * size;
      const fees = Math.random() * 0.5;
      
      trades.push({
        id: `trade-${i}`,
        symbol,
        action: Math.random() > 0.5 ? 'long' : 'short',
        isLong: Math.random() > 0.5,
        entryPrice,
        exitPrice,
        size,
        fee: fees,
        pnl,
        timestamp: entryTime,
        entryTime,
        exitTime,
        orderType: Math.random() > 0.7 ? 'limit' : 'market',
      });
    }
    
    return trades.sort((a, b) => b.entryTime - a.entryTime);
  };

  const metrics = useTradingMetrics(filteredTrades, filters);

  if (!publicKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Deriverse Analytics Dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            Connect your Solana wallet to analyze your trading performance, track PnL, and get AI-powered insights.
          </p>
          <div className="flex justify-center">
            <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white !rounded-lg !px-6 !py-3 !font-semibold hover:!from-blue-700 hover:!to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading your trading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Deriverse Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Connected: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white !rounded-lg !px-4 !py-2 !font-semibold hover:!from-blue-700 hover:!to-purple-700 transition-all duration-300" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="mb-8">
          <FilterBar 
            trades={trades} 
            onFilterChange={setFilters}
            currentFilters={filters}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total PnL" 
            value={`$${metrics.totalPnL.toFixed(2)}`}
            change={metrics.totalPnL}
            description="Net profit/loss across all trades"
            gradient="from-green-400 to-emerald-600"
          />
          <StatCard 
            title="Win Rate" 
            value={`${(metrics.winRate * 100).toFixed(1)}%`}
            description="Percentage of profitable trades"
            gradient="from-blue-400 to-cyan-600"
          />
          <StatCard 
            title="Max Drawdown" 
            value={`$${Math.abs(metrics.maxDrawdown).toFixed(2)}`}
            change={-metrics.maxDrawdown}
            description="Largest peak-to-trough decline"
            gradient="from-red-400 to-rose-600"
          />
          <StatCard 
            title="Avg Trade Duration" 
            value={`${Math.round(metrics.avgTradeDuration / 60000)}m`}
            description="Average time per trade"
            gradient="from-purple-400 to-violet-600"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Largest Gain" 
            value={`$${metrics.largestGainLoss.largestGain?.toFixed(2) || '0.00'}`}
            description="Best performing trade"
            gradient="from-green-400 to-teal-600"
            compact
          />
          <StatCard 
            title="Largest Loss" 
            value={`$${Math.abs(metrics.largestGainLoss.largestLoss || 0).toFixed(2)}`}
            description="Worst performing trade"
            gradient="from-red-400 to-pink-600"
            compact
          />
          <StatCard 
            title="Total Volume" 
            value={`$${metrics.totalVolume.toFixed(0)}`}
            description={`${filteredTrades.length} trades`}
            gradient="from-amber-400 to-orange-600"
            compact
          />
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* PnL Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">PnL Over Time</h2>
              <div className="h-80">
                <PnLChart trades={filteredTrades} />
              </div>
            </div>
          </div>

          {/* Time Analysis */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Time Analysis</h2>
              <TimeAnalysis trades={filteredTrades} />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trade History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Trade History</h2>
              <div className="overflow-x-auto">
                <TradeHistory trades={filteredTrades.slice(0, 10)} />
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">AI Trading Coach</h2>
              <AIInsightPanel metrics={{
                pnl: metrics.totalPnL,
                winRate: metrics.winRate,
                drawdown: metrics.maxDrawdown,
                feeImpact: metrics.feeImpact,
                longShortRatio: metrics.longShortRatio,
                avgTradeDuration: metrics.avgTradeDuration,
                largestGain: metrics.largestGainLoss.largestGain,
                largestLoss: metrics.largestGainLoss.largestLoss
              }} trades={filteredTrades} />
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Showing {filteredTrades.length} of {trades.length} trades • 
            Long/Short: {(metrics.longShortRatio * 100).toFixed(0)}% long • 
            Fee Impact: ${metrics.feeImpact.toFixed(2)} • 
            Avg Win/Loss: ${metrics.avgWinLoss?.avgWin?.toFixed(2) || '0.00'} / ${Math.abs(metrics.avgWinLoss?.avgLoss || 0).toFixed(2)}
          </p>
        </div>
      </main>
    </div>
  );
}