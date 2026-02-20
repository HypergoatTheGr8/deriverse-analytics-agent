'use client';
import { useState, useEffect } from 'react';
import { Trade } from '@/types/trade';

interface FilterBarProps {
  trades: Trade[];
  onFilterChange: (filters: { symbol?: string; fromDate?: number; toDate?: number }) => void;
  currentFilters: { symbol?: string; fromDate?: number; toDate?: number };
}

export default function FilterBar({ trades, onFilterChange, currentFilters }: FilterBarProps) {
  const [localSymbol, setLocalSymbol] = useState(currentFilters.symbol || '');
  const [localFromDate, setLocalFromDate] = useState<string>('');
  const [localToDate, setLocalToDate] = useState<string>('');
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique symbols from trades
    const symbols = Array.from(new Set(trades.map(trade => trade.symbol))).sort();
    setAvailableSymbols(symbols);
  }, [trades]);

  useEffect(() => {
    // Convert string dates to timestamps when they change
    const filters: { symbol?: string; fromDate?: number; toDate?: number } = {};
    
    if (localSymbol && validateSymbol(localSymbol)) {
      filters.symbol = localSymbol;
    }
    
    if (localFromDate && validateDate(localFromDate)) {
      const fromDate = new Date(localFromDate);
      if (!isNaN(fromDate.getTime())) {
        filters.fromDate = fromDate.getTime();
      }
    }
    
    if (localToDate && validateDate(localToDate)) {
      const toDate = new Date(localToDate);
      if (!isNaN(toDate.getTime())) {
        // Add one day to include the entire selected day
        filters.toDate = toDate.getTime() + 86400000 - 1;
      }
    }
    
    // Validate date range
    if (filters.fromDate && filters.toDate && filters.fromDate > filters.toDate) {
      // Swap dates if from > to
      [filters.fromDate, filters.toDate] = [filters.toDate, filters.fromDate];
    }
    
    // Apply filters after a short delay to avoid excessive updates
    const timeoutId = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [localSymbol, localFromDate, localToDate, onFilterChange]);

  const validateSymbol = (symbol: string): boolean => {
    // Basic symbol validation: alphanumeric with optional slash
    return /^[A-Z0-9]+\/[A-Z0-9]+$/.test(symbol) || /^[A-Z0-9]+$/.test(symbol);
  };

  const validateDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.length === 10;
  };

  // Calculate min and max dates from trades
  const minDate = trades.length > 0 
    ? new Date(Math.min(...trades.map(t => t.entryTime))).toISOString().split('T')[0]
    : '';
  const maxDate = trades.length > 0
    ? new Date(Math.max(...trades.map(t => t.exitTime))).toISOString().split('T')[0]
    : '';

  const clearFilters = () => {
    setLocalSymbol('');
    setLocalFromDate('');
    setLocalToDate('');
  };

  const activeFilterCount = [
    localSymbol ? 1 : 0,
    localFromDate ? 1 : 0,
    localToDate ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
          <p className="text-gray-600 text-sm">
            Filter your trading data to analyze specific time periods and symbols
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Symbol Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Symbol
            {localSymbol && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                Active
              </span>
            )}
          </label>
          <select
            value={localSymbol}
            onChange={(e) => setLocalSymbol(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
          >
            <option value="">All Symbols</option>
            {availableSymbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
          {localSymbol && (
            <p className="text-xs text-gray-500">
              Showing trades for {localSymbol} only
            </p>
          )}
        </div>

        {/* From Date Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            From Date
            {localFromDate && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                Active
              </span>
            )}
          </label>
          <input
            type="date"
            value={localFromDate}
            min={minDate}
            max={localToDate || maxDate}
            onChange={(e) => setLocalFromDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
          />
          {localFromDate && (
            <p className="text-xs text-gray-500">
              Showing trades from {new Date(localFromDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* To Date Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            To Date
            {localToDate && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                Active
              </span>
            )}
          </label>
          <input
            type="date"
            value={localToDate}
            min={localFromDate || minDate}
            max={maxDate}
            onChange={(e) => setLocalToDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
          />
          {localToDate && (
            <p className="text-xs text-gray-500">
              Showing trades until {new Date(localToDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Trades</p>
            <p className="text-2xl font-bold text-gray-800">{trades.length}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Filtered</p>
            <p className="text-2xl font-bold text-blue-600">
              {trades.filter(t => {
                if (localSymbol && t.symbol !== localSymbol) return false;
                if (localFromDate && t.entryTime < new Date(localFromDate).getTime()) return false;
                if (localToDate && t.exitTime > new Date(localToDate).getTime()) return false;
                return true;
              }).length}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Date Range</p>
            <p className="text-lg font-semibold text-gray-800">
              {minDate && maxDate ? `${new Date(minDate).toLocaleDateString()} - ${new Date(maxDate).toLocaleDateString()}` : 'N/A'}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Unique Symbols</p>
            <p className="text-2xl font-bold text-gray-800">{availableSymbols.length}</p>
          </div>
        </div>
      </div>

      {/* Visual filter indicators */}
      {activeFilterCount > 0 && (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {localSymbol && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Symbol: {localSymbol}
                <button 
                  onClick={() => setLocalSymbol('')}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {localFromDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                From: {new Date(localFromDate).toLocaleDateString()}
                <button 
                  onClick={() => setLocalFromDate('')}
                  className="ml-1 text-green-500 hover:text-green-700"
                >
                  ×
                </button>
              </span>
            )}
            {localToDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                To: {new Date(localToDate).toLocaleDateString()}
                <button 
                  onClick={() => setLocalToDate('')}
                  className="ml-1 text-purple-500 hover:text-purple-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}