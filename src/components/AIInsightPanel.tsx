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
    
    // Simulated AI insight for demo (would call Gemini API in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const insights = [
      `Your win rate of ${metrics.winRate.toFixed(1)}% is solid. Consider reducing position size on losing streaks to protect capital.`,
      `You've made ${trades.length} trades. Your best performing asset appears to be SOL-PERP. Focus more capital there.`,
      `Fee impact is eating into profits. Consider using limit orders more frequently to reduce costs.`,
      `Your long bias (${trades.filter(t => t.isLong).length}/${trades.length} trades) may expose you to downside risk in bear markets.`
    ];
    
    setInsight(insights[Math.floor(Math.random() * insights.length)]);
    setLoading(false);
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
