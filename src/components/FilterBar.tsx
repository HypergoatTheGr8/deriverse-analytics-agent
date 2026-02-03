'use client';

import { useState } from 'react';

interface FilterBarProps {
  onFilter: (symbol: string, dateFrom: string, dateTo: string) => void;
}

const symbols = ['', 'SOL-PERP', 'BTC-PERP', 'ETH-PERP'];

export function FilterBar({ onFilter }: FilterBarProps) {
  const [symbol, setSymbol] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleApply = () => {
    onFilter(symbol, dateFrom, dateTo);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Symbol</label>
        <select 
          value={symbol} 
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-gray-700 text-white rounded px-3 py-2 min-w-[140px]"
        >
          <option value="">All Symbols</option>
          {symbols.filter(s => s).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">From Date</label>
        <input 
          type="date" 
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="bg-gray-700 text-white rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">To Date</label>
        <input 
          type="date" 
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="bg-gray-700 text-white rounded px-3 py-2"
        />
      </div>
      <button 
        onClick={handleApply}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition"
      >
        Apply Filters
      </button>
    </div>
  );
}
