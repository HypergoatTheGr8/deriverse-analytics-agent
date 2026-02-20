'use client';
import { useState, useEffect } from 'react';
import { usePrices } from '@/hooks/usePrices';
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
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ symbol?: string; fromDate?: number; toDate?: number }>({});

  useEffect(() => {
    if (publicKey) {
      loadTrades();
    }
  }, [publicKey]);

  // Real-time prices (USD) for top symbols used in the UI
  const { prices: marketPrices, loading: pricesLoading } = usePrices(15000);

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
    setError(null);
      try {
      // Use server API to fetch trades (Helius API key stays server-side)
      const res = await fetch(`/api/helius/transactions?wallet=${publicKey.toString()}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch trades from server');
      }
      const walletTrades = await res.json();
      setTrades(walletTrades);
    } catch (error: any) {
      console.error('Failed to load trades:', error);
      setError(`Failed to load trading data: ${error.message}. You can enter another wallet address below or add a HELIUS_API_KEY to your environment to enable Helius parsing.`);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  // Manual fetch by arbitrary wallet address (useful when connected wallet has no visible trades)
  const [manualWallet, setManualWallet] = useState('');
  const fetchForAddress = async (addr: string) => {
    if (!addr) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/helius/transactions?wallet=${addr}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch trades from server');
      }
      const walletTrades = await res.json();
      setTrades(walletTrades);
    } catch (err: any) {
      console.error('Manual fetch failed:', err);
      setError(`Failed to fetch for ${addr}: ${err.message}`);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useTradingMetrics(filteredTrades, filters);

  if (!publicKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-gray-900 p-8">
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent mb-4">
            Deriverse Analytics Dashboard
          </h1>
          <p className="text-gray-300 mb-6">
            Connect your Solana wallet to analyze your trading performance, track PnL, and get AI-powered insights.
          </p>
          <div className="flex justify-center">
            <WalletMultiButton className="!bg-gradient-to-r !from-teal-600 !to-amber-600 !text-white !rounded-lg !px-6 !py-3 !font-semibold hover:!from-teal-500 hover:!to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading your trading data from Solana blockchain...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching transaction history via Helius API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
                Deriverse Analytics Dashboard
              </h1>
              <p className="text-gray-300 mt-2">
                Connected: <span className="font-mono text-sm bg-gray-800 border border-gray-700 px-2 py-1 rounded text-amber-300">{publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {pricesLoading && <span>Loading prices…</span>}
                {!pricesLoading && marketPrices && (
                  <span>
                    SOL: <span className="font-mono">${marketPrices.SOL?.toFixed(2) ?? '—'}</span>
                    {' • '}
                    BTC: <span className="font-mono">${marketPrices.BTC?.toFixed(2) ?? '—'}</span>
                    {' • '}
                    ETH: <span className="font-mono">${marketPrices.ETH?.toFixed(2) ?? '—'}</span>
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <WalletMultiButton className="!bg-gradient-to-r !from-teal-600 !to-amber-600 !text-white !rounded-lg !px-4 !py-2 !font-semibold hover:!from-teal-500 hover:!to-amber-500 transition-all duration-300" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-amber-900/30 border border-amber-700 rounded-xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-300">Data Loading Notice</h3>
                <div className="mt-2 text-sm text-amber-200">
                  <p>{error}</p>
                  <p className="mt-1 text-amber-300/80">
                    No on-chain trades were found or parsing failed. Try entering a different wallet address below, or add a HELIUS_API_KEY in Vercel or `.env.local` to enable richer Helius parsing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <FilterBar 
            trades={trades} 
            onFilterChange={setFilters}
            currentFilters={filters}
          />

          {/* Manual wallet fetch when automatic fetch fails or for viewing other wallets */}
          <div className="mt-4 flex gap-2 items-center">
            <input
              value={manualWallet}
              onChange={(e) => setManualWallet(e.target.value)}
              placeholder="Paste wallet address to fetch trades"
              className="bg-gray-700 text-white rounded px-3 py-2 w-full max-w-md"
            />
            <button
              onClick={() => fetchForAddress(manualWallet)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded"
            >
              Fetch
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total PnL" 
            value={`$${metrics.totalPnL.toFixed(2)}`}
            change={metrics.totalPnL}
            description="Net profit/loss across all trades"
            gradient="from-emerald-500 to-teal-500"
          />
          <StatCard 
            title="Win Rate" 
            value={`${(metrics.winRate * 100).toFixed(1)}%`}
            description="Percentage of profitable trades"
            gradient="from-teal-500 to-cyan-500"
          />
          <StatCard 
            title="Max Drawdown" 
            value={`${(metrics.maxDrawdown * 100).toFixed(1)}%`}
            change={metrics.maxDrawdown}
            description="Largest peak-to-trough decline (percent)"
            gradient="from-rose-500 to-pink-500"
          />
          <StatCard 
            title="Avg Trade Duration" 
            value={`${Math.round(metrics.avgTradeDuration / 60000)}m`}
            description="Average time per trade"
            gradient="from-amber-500 to-orange-500"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Largest Gain" 
            value={`$${metrics.largestGainLoss.largestGain?.toFixed(2) || '0.00'}`}
            description="Best performing trade"
            gradient="from-emerald-500 to-green-500"
            compact
          />
          <StatCard 
            title="Largest Loss" 
            value={`$${Math.abs(metrics.largestGainLoss.largestLoss || 0).toFixed(2)}`}
            description="Worst performing trade"
            gradient="from-rose-500 to-red-500"
            compact
          />
          <StatCard 
            title="Total Volume" 
            value={`$${metrics.totalVolume.toFixed(0)}`}
            description={`${filteredTrades.length} trades`}
            gradient="from-amber-500 to-yellow-500"
            compact
          />
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* PnL Chart */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-200 mb-4">PnL Over Time</h2>
              <div className="h-80">
                <PnLChart trades={filteredTrades} />
              </div>
            </div>
          </div>

          {/* Time Analysis */}
          <div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-200 mb-4">Time Analysis</h2>
              <TimeAnalysis trades={filteredTrades} />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trade History */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-200 mb-4">Trade History</h2>
              <div className="overflow-x-auto">
                <TradeHistory trades={filteredTrades.slice(0, 10)} />
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-200 mb-4">AI Trading Coach</h2>
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
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            Showing {filteredTrades.length} of {trades.length} trades • 
            Long/Short: {(metrics.longShortRatio * 100).toFixed(0)}% long • 
            Fee Impact: {(metrics.feeImpact * 100).toFixed(2)}% • 
            Avg Win/Loss: ${metrics.avgWinLoss?.avgWin?.toFixed(2) || '0.00'} / ${Math.abs(metrics.avgWinLoss?.avgLoss || 0).toFixed(2)}
          </p>
        </div>
      </main>
    </div>
  );
}
