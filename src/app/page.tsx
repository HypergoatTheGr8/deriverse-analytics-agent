import { Trade, TradingMetrics } from './types';
import { AIInsightPanel } from './components/AIInsightPanel';

// Mock data for testing
const mockTrades: Trade[] = [
  { id: 1, symbol: 'SOL', side: 'buy', price: 100, quantity: 1, timestamp: '2023-10-01' },
  { id: 2, symbol: 'BTC', side: 'sell', price: 50000, quantity: 0.1, timestamp: '2023-10-02' },
];

const mockMetrics: TradingMetrics = {
  pnl: 1500,
  winRate: 0.75,
  drawdown: 0.1,
};

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Deriverse Analytics Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Trade History</h2>
        <div className="bg-gray-800 p-4 rounded">
          {/* Trade history table or list would go here */}
          <p className="text-white">Trade history data will be displayed here.</p>
        </div>
      </div>
      <AIInsightPanel trades={mockTrades} metrics={mockMetrics} />
    </div>
  );
}
