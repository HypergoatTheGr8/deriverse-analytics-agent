'use client';

import { useState } from 'react';
import { Trade } from '@/types/trade';
import { TradeAnnotation } from './TradeAnnotation';

interface TradeHistoryProps {
  trades: Trade[];
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  const [annotationOpen, setAnnotationOpen] = useState(false);
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const hasNote = (tradeId: string) => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(`trade-note-${tradeId}`);
  };

  const openAnnotation = (tradeId: string) => {
    setSelectedTradeId(tradeId);
    setAnnotationOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Side</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Entry</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Exit</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">PnL</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{formatTime(trade.timestamp)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-white font-medium">{trade.symbol}</td>
                <td className={`px-4 py-2 whitespace-nowrap text-sm font-medium ${trade.isLong ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.isLong ? 'LONG' : 'SHORT'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400 uppercase">{trade.orderType}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{trade.size}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">${trade.entryPrice.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">${trade.exitPrice.toFixed(2)}</td>
                <td className={`px-4 py-2 whitespace-nowrap text-sm font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <button
                    onClick={() => openAnnotation(trade.id)}
                    className={`p-1 rounded hover:bg-gray-700 ${hasNote(trade.id) ? 'text-yellow-400' : 'text-gray-500'}`}
                    title="Add note"
                  >
                    📝
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedTradeId && (
        <TradeAnnotation
          tradeId={selectedTradeId}
          isOpen={annotationOpen}
          onClose={() => setAnnotationOpen(false)}
        />
      )}
    </>
  );
}
