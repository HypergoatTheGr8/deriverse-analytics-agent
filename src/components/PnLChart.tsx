'use client';
import { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area,
  ComposedChart,
  ReferenceLine
} from 'recharts';
import { Trade } from '@/types/trade';

interface PnLChartProps {
  trades: Trade[];
  prices?: Record<string, number> | null;
}

interface ChartDataPoint {
  date: string;
  pnl: number;
  cumulativePnL: number;
  drawdown: number;
  equity: number;
}

export default function PnLChart({ trades, prices }: PnLChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [maxDrawdown, setMaxDrawdown] = useState(0);

  useEffect(() => {
    if (trades.length === 0) return;

    // Sort trades by exit time
    const sortedTrades = [...trades].sort((a, b) => a.exitTime - b.exitTime);
    
    // Calculate equity curve and drawdowns
    let cumulativePnL = 0;
    let peak = 0;
    const data: ChartDataPoint[] = [];
    
    // Group by day for cleaner chart
    const dailyData: { [date: string]: { pnl: number, date: Date } } = {};
    
    sortedTrades.forEach(trade => {
      const date = new Date(trade.exitTime);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { pnl: 0, date };
      }
      dailyData[dateKey].pnl += trade.pnl;
    });
    
    // Convert to chart data with cumulative calculations
    Object.entries(dailyData)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .forEach(([dateKey, { pnl, date }]) => {
        cumulativePnL += pnl;
        peak = Math.max(peak, cumulativePnL);
        const drawdown = cumulativePnL - peak;
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          pnl,
          cumulativePnL,
          drawdown: Math.min(0, drawdown), // Drawdown is negative or zero
          equity: cumulativePnL
        });
      });

    // Calculate max drawdown
    const drawdowns = data.map(d => d.drawdown);
    const calculatedMaxDrawdown = Math.min(...drawdowns);
    setMaxDrawdown(calculatedMaxDrawdown);
    setChartData(data);
  }, [trades]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-gray-300 font-medium mb-2">{label}</p>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-400">Daily PnL: </span>
              <span className={`font-semibold ${payload[0].value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${payload[0].value.toFixed(2)}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400">Cumulative: </span>
              <span className={`font-semibold ${payload[1].value >= 0 ? 'text-green-400' : 'text-blue-400'}`}>
                ${payload[1].value.toFixed(2)}
              </span>
            </p>
            {payload[2] && payload[2].value < 0 && (
              <p className="text-sm">
                <span className="text-gray-400">Drawdown: </span>
                <span className="font-semibold text-red-400">
                  ${Math.abs(payload[2].value).toFixed(2)}
                </span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (trades.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No trade data available
      </div>
    );
  }

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            {/* Gradient for positive PnL area */}
            <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            
            {/* Gradient for negative PnL area */}
            <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
            
            {/* Gradient for equity curve */}
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#374151" 
            opacity={0.3}
            vertical={false}
          />
          
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF" 
            fontSize={11}
            tickMargin={10}
            axisLine={{ stroke: '#4B5563' }}
          />
          
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={11}
            tickMargin={10}
            axisLine={{ stroke: '#4B5563' }}
            tickFormatter={(value) => `$${value}`}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Drawdown area (shows when equity is below peak) */}
          {maxDrawdown < 0 && (
            <ReferenceLine 
              y={maxDrawdown} 
              stroke="#EF4444" 
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: `Max Drawdown: $${Math.abs(maxDrawdown).toFixed(2)}`,
                position: 'insideBottomRight',
                fill: '#EF4444',
                fontSize: 12
              }}
            />
          )}
          
          {/* Zero line reference */}
          <ReferenceLine 
            y={0} 
            stroke="#6B7280" 
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          
          {/* Daily PnL bars (positive/negative colors) */}
          {chartData.map((entry, index) => (
            <Area
              key={index}
              data={[entry]}
              dataKey="pnl"
              stroke="none"
              fill={entry.pnl >= 0 ? "url(#positiveGradient)" : "url(#negativeGradient)"}
              fillOpacity={0.8}
              isAnimationActive={false}
            />
          ))}
          
          {/* Equity curve (cumulative PnL) */}
          <Area
            type="monotone"
            dataKey="cumulativePnL"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#equityGradient)"
            fillOpacity={0.3}
            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#1E40AF' }}
            activeDot={{ r: 6, fill: '#60A5FA', stroke: '#3B82F6', strokeWidth: 2 }}
            connectNulls={true}
          />
          
          {/* Drawdown line */}
          <Line
            type="monotone"
            dataKey="drawdown"
            stroke="#EF4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4, fill: '#EF4444' }}
            connectNulls={true}
          />
          
          {/* Peak line annotation */}
          {chartData.length > 0 && (
            <ReferenceLine 
              y={Math.max(...chartData.map(d => d.cumulativePnL))}
              stroke="#10B981"
              strokeWidth={1}
              strokeDasharray="3 3"
              label={{
                value: 'Peak',
                position: 'insideTopRight',
                fill: '#10B981',
                fontSize: 12
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-400">Equity Curve</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-400">Drawdown</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3" style={{ background: 'linear-gradient(to bottom, #10B981, transparent)' }}></div>
          <span className="text-gray-400">Daily PnL</span>
        </div>
      </div>
    </div>
  );
}