import { StatCard } from '@/components/StatCard';
import { PnLChart } from '@/components/PnLChart';
import { TradeHistory } from '@/components/TradeHistory';

const sampleData = [
  { date: '2024-01-01', pnl: 1000 },
  { date: '2024-01-02', pnl: 1500 },
  { date: '2024-01-03', pnl: 800 },
  { date: '2024-01-04', pnl: 2000 },
];

const sampleTrades = [
  { time: '10:30', action: 'BUY', size: 100, pnl: 50 },
  { time: '11:45', action: 'SELL', size: 50, pnl: -20 },
  { time: '14:20', action: 'BUY', size: 200, pnl: 150 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total PnL" value="$3,450" change="+12.5%" />
        <StatCard label="Win Rate" value="72%" />
        <StatCard label="Avg Trade" value="$245" />
        <StatCard label="Trades" value="42" />
      </div>

      <div className="mb-6">
        <PnLChart data={sampleData} />
      </div>

      <div className="mb-6">
        <TradeHistory trades={sampleTrades} />
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Connect Wallet
      </button>
    </div>
  );
}