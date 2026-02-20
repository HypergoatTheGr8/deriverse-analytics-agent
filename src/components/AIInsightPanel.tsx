'use client';

import { useState } from 'react';
import { Trade, TradingMetrics } from '@/types/trade';

interface AIInsightPanelProps {
  trades: Trade[];
  metrics: TradingMetrics;
}

export function AIInsightPanel({ trades, metrics }: AIInsightPanelProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    
    try {
      // Call server-side API which uses OPENROUTER_API_KEY (keeps secret server-side)
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trades, metrics }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `AI server returned ${res.status}`);
      }

      const json = await res.json();
      if (json?.insight) setInsight(json.insight);
      else throw new Error(json?.error || 'No insight returned');
    } catch (error: any) {
      console.error('Failed to generate AI insight:', error);
      // Fallback to intelligent insights based on data
      const fallbackInsights = generateFallbackInsights();
      setInsight(fallbackInsights[Math.floor(Math.random() * fallbackInsights.length)]);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackInsights = (): string[] => {
    const longTrades = trades.filter(t => t.isLong).length;
    const shortTrades = trades.filter(t => !t.isLong).length;
    const profitableTrades = trades.filter(t => t.pnl > 0).length;
    const totalFees = trades.reduce((sum, trade) => sum + trade.fee, 0);
    const avgTradeSize = trades.length > 0 ? trades.reduce((sum, trade) => sum + trade.size, 0) / trades.length : 0;
    
    return [
      `Your ${(metrics.winRate * 100).toFixed(1)}% win rate is ${metrics.winRate > 0.5 ? 'strong' : 'needs improvement'}. ${metrics.winRate > 0.5 ? 'Maintain this edge while working on risk management.' : 'Focus on improving entry timing and trade selection.'}`,
      `You've executed ${trades.length} trades with ${longTrades} long and ${shortTrades} short positions. ${longTrades > shortTrades * 1.5 ? 'Your long bias could expose you in downtrends.' : 'Your balanced approach helps manage directional risk.'}`,
      `Fees total $${totalFees.toFixed(2)} (${(metrics.pnl ? ((totalFees / Math.abs(metrics.pnl)) * 100).toFixed(1) : '0.0')}% of PnL). ${metrics.pnl && totalFees > Math.abs(metrics.pnl) * 0.2 ? 'Consider reducing trade frequency or using limit orders.' : 'Your fee management is efficient.'}`,
      `Average position size is ${avgTradeSize.toFixed(2)}. ${avgTradeSize > 5 ? 'Your larger positions increase both potential gains and risks.' : 'Conservative sizing helps manage drawdowns.'}`,
      `Max drawdown of ${(metrics.drawdown * 100).toFixed(1)}% ${(metrics.drawdown * 100) > 20 ? 'exceeds recommended limits. Consider tighter stops.' : 'is within acceptable risk parameters.'}`,
      `Best trade gained $${metrics.largestGain?.toFixed(2) || '0.00'}, worst lost $${Math.abs(metrics.largestLoss || 0).toFixed(2)}. ${(metrics.largestGain || 0) > Math.abs(metrics.largestLoss || 0) * 2 ? 'Your winners outperform losers - good risk-reward ratio.' : 'Work on letting winners run and cutting losers quickly.'}`
    ];
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>🤖</span> AI Trading Coach
      </h2>
      
      {!insight && !loading && (
        <button
          onClick={generateInsight}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition"
        >
          Generate Insights
        </button>
      )}
      
      {loading && (
        <div className="flex items-center gap-2 text-gray-400">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          Analyzing your trading patterns...
        </div>
      )}
      
      {insight && (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">{insight}</p>
          <button
            onClick={generateInsight}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Get another insight →
          </button>
        </div>
      )}
    </div>
  );
}
