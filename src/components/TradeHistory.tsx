interface Trade {
  time: string;
  action: 'BUY' | 'SELL';
  size: number;
  pnl: number;
}

interface TradeHistoryProps {
  trades: Trade[];
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">PnL</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {trades.map((trade, index) => (
            <tr key={index}>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{trade.time}</td>
              <td className={`px-4 py-2 whitespace-nowrap text-sm ${trade.action === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                {trade.action}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{trade.size}</td>
              <td className={`px-4 py-2 whitespace-nowrap text-sm ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trade.pnl}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}