interface StatCardProps { label: string; value: string; change?: string; }
export function StatCard({ label, value, change }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {change && <p className="text-sm text-green-400">{change}</p>}
    </div>
  );
}