import { useState } from 'react';
import { Trade, TradingMetrics } from '../types';
import { generateTradeInsight } from '../lib/gemini';

type AIInsightPanelProps = {
  trades: Trade[];
  metrics: TradingMetrics;
};

export function AIInsightPanel({ trades, metrics }: AIInsightPanelProps) {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    try {
      const generatedInsights = await generateTradeInsight(trades, metrics);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error:', error);
      setInsights('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
      <button
        onClick={handleGenerateInsights}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isLoading ? 'Generating...' : 'Generate Insights'}
      </button>
      {insights && (
        <div className="mt-4 p-3 bg-gray-700 rounded">
          <p className="text-white">{insights}</p>
        </div>
      )}
    </div>
  );
}
