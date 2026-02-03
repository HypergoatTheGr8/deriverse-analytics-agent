import React, { useState } from 'react';
import { Trade } from '../types/trade';

interface FilterBarProps {
  onFilter: (filters: { symbol?: string; fromDate?: number; toDate?: number }) => void;
  symbols: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilter, symbols }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const handleApply = () => {
    onFilter({
      symbol: selectedSymbol || undefined,
      fromDate: fromDate ? new Date(fromDate).getTime() : undefined,
      toDate: toDate ? new Date(toDate).getTime() : undefined,
    });
  };

  return (
    <div className="filter-bar dark-theme">
      <select
        value={selectedSymbol}
        onChange={(e) => setSelectedSymbol(e.target.value)}
        className="symbol-dropdown"
      >
        <option value="">All Symbols</option>
        {symbols.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="date-input"
        placeholder="From Date"
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="date-input"
        placeholder="To Date"
      />

      <button onClick={handleApply} className="apply-button">
        Apply
      </button>
    </div>
  );
};
