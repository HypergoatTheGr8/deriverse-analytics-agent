import { Trade, TradingMetrics } from '@/types/trade';

export async function generateTradeInsight(trades: Trade[], metrics: TradingMetrics): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

  // If no API key, use intelligent simulation based on actual data
  if (!apiKey) {
    return generateIntelligentInsight(trades, metrics);
  }

  try {
    // Use OpenRouter's chat completions endpoint with the requested open model
    const prompt = `Analyze this trading data and provide 2-3 actionable insights about patterns, risks, or improvements. Be specific and concise.\n\nTrading Data Summary:\n- Total Trades: ${trades.length}\n- Win Rate: ${(metrics.winRate * 100).toFixed(1)}%\n- Total PnL: $${metrics.pnl.toFixed(2)}\n- Max Drawdown: ${Math.abs(metrics.drawdown).toFixed(2)}%\n- Long/Short Ratio: ${(metrics.longShortRatio || 0).toFixed(1)}% long\n- Average Trade Duration: ${Math.round((metrics.avgTradeDuration || 0) / 60000)} minutes\n- Largest Gain: $${metrics.largestGain?.toFixed(2) || '0.00'}\n- Largest Loss: $${Math.abs(metrics.largestLoss || 0).toFixed(2)}\n- Fee Impact: $${metrics.feeImpact?.toFixed(2) || '0.00'}\n\nProvide insights that would help improve trading performance.`;

    const response = await fetch('https://api.openrouter.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenRouter request failed: ${response.status} ${text}`);
    }

    const result = await response.json();

    // Try common response shapes
    const content = result?.choices?.[0]?.message?.content || result?.choices?.[0]?.message?.content?.text || result?.choices?.[0]?.message?.content?.parts?.[0] || result?.results?.[0]?.output?.[0]?.content?.[0]?.text;
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return content.join('\n');
    if (content && typeof content === 'object') return JSON.stringify(content);

    return 'No insights generated.';
  } catch (error: any) {
    console.error('Error generating insights with OpenRouter API:', error?.message || error);
    // Fallback to intelligent simulation
    return generateIntelligentInsight(trades, metrics);
  }
}

function generateIntelligentInsight(trades: Trade[], metrics: TradingMetrics): string {
  const insights: string[] = [];
  
  // Analyze win rate
  if (metrics.winRate < 0.3) {
    insights.push(`Your win rate of ${(metrics.winRate * 100).toFixed(1)}% is quite low. Consider tightening your stop-losses and focusing on higher-probability setups.`);
  } else if (metrics.winRate > 0.6) {
    insights.push(`Excellent win rate of ${(metrics.winRate * 100).toFixed(1)}%! Your trade selection is working well. Consider increasing position size on your best setups.`);
  } else {
    insights.push(`Solid win rate of ${(metrics.winRate * 100).toFixed(1)}%. Maintain this consistency while working on improving your risk-reward ratio.`);
  }
  
  // Analyze drawdown
  // drawdown is a fraction (0..1) now
  if ((metrics.drawdown || 0) > 0.2) {
    insights.push(`Your max drawdown of ${(metrics.drawdown * 100).toFixed(1)}% is concerning. Consider reducing position sizes or adding more diversification to manage risk.`);
  }
  
  // Analyze trade frequency
  if (trades.length > 50) {
    insights.push(`You're trading frequently (${trades.length} trades). Consider focusing on quality over quantity - fewer, higher-conviction trades often yield better results.`);
  } else if (trades.length < 10) {
    insights.push(`With only ${trades.length} trades, it's hard to assess patterns. Consider tracking more trades to get meaningful insights.`);
  }
  
  // Analyze fee impact
  const totalFees = trades.reduce((sum, trade) => sum + trade.fee, 0);
  const feeToPnLRatio = metrics.pnl ? totalFees / Math.abs(metrics.pnl) : 0;
  if (feeToPnLRatio > 0.3) {
    insights.push(`Fees are eating ${(feeToPnLRatio * 100).toFixed(0)}% of your PnL. Consider using limit orders more often to reduce trading costs.`);
  }
  
  // Analyze position sizing
  const avgSize = trades.reduce((sum, trade) => sum + trade.size, 0) / trades.length;
  const sizeStdDev = Math.sqrt(
    trades.reduce((sum, trade) => sum + Math.pow(trade.size - avgSize, 2), 0) / trades.length
  );
  if (sizeStdDev / avgSize > 0.5) {
    insights.push(`Your position sizes vary significantly. Consider standardizing your position sizing to improve consistency.`);
  }
  
  // Return 2-3 insights
  return insights.slice(0, 3).join(' ');
}
