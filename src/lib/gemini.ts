import { Trade, TradingMetrics } from '@/types/trade';

export async function generateTradeInsight(trades: Trade[], metrics: TradingMetrics): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || 'placeholder_key';
  const prompt = "Analyze this trading data and provide 2-3 actionable insights about patterns, risks, or improvements. Be specific and concise.";

  try {
    const response = await fetch('https://api.gemini.ai/v1/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        data: { trades, metrics },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.insights || 'No insights generated.';
  } catch (error) {
    console.error('Error generating insights:', error);
    return 'Failed to generate insights. Please try again.';
  }
}
