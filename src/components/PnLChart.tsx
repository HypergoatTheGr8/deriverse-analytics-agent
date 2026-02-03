import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PnLChartProps {
  data: { date: string; pnl: number }[];
}

export function PnLChart({ data }: PnLChartProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }} />
          <Legend />
          <Line type="monotone" dataKey="pnl" stroke="#10B981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}