'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';

interface PnLChartProps {
  data: { date: string; pnl: number; drawdown?: number }[];
}

export function PnLChart({ data }: PnLChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <defs>
          <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} 
          labelStyle={{ color: '#9CA3AF' }}
        />
        <Area 
          type="monotone" 
          dataKey="pnl" 
          stroke="#10B981" 
          fill="url(#pnlGradient)" 
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="drawdown" 
          stroke="#EF4444" 
          strokeWidth={2} 
          strokeDasharray="5 5"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
