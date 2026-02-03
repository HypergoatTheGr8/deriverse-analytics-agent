'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trade } from '@/types/trade';

interface TimeAnalysisProps {
  trades: Trade[];
}

export function TimeAnalysis({ trades }: TimeAnalysisProps) {
  // Calculate hourly performance
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourTrades = trades.filter(t => new Date(t.timestamp).getHours() === hour);
    const avgPnl = hourTrades.length > 0 
      ? hourTrades.reduce((sum, t) => sum + t.pnl, 0) / hourTrades.length 
      : 0;
    return { hour: `${hour}:00`, avgPnl, count: hourTrades.length };
  });

  // Calculate session performance
  const getSession = (hour: number) => {
    if (hour >= 0 && hour < 8) return 'Asian';
    if (hour >= 8 && hour < 16) return 'London';
    return 'New York';
  };

  const sessionData = ['Asian', 'London', 'New York'].map(session => {
    const sessionTrades = trades.filter(t => getSession(new Date(t.timestamp).getHours()) === session);
    const totalPnl = sessionTrades.reduce((sum, t) => sum + t.pnl, 0);
    return { session, pnl: totalPnl, count: sessionTrades.length };
  });

  return (
    <div className="space-y-6">
      {/* Session Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sessionData.map(s => (
          <div key={s.session} className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">{s.session} Session</p>
            <p className={`text-xl font-bold ${s.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${s.pnl.toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs">{s.count} trades</p>
          </div>
        ))}
      </div>

      {/* Hourly Chart */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Performance by Hour</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={10} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
            />
            <Bar dataKey="avgPnl" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
