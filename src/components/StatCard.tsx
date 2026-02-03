interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export function StatCard({ label, value, change, isPositive }: StatCardProps) {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 hover:scale-105 transition-all duration-200 cursor-pointer border-l-4 ${
      isPositive === true ? 'border-green-500 hover:shadow-green-500/20 hover:shadow-lg' : 
      isPositive === false ? 'border-red-500 hover:shadow-red-500/20 hover:shadow-lg' : 
      'border-gray-700 hover:shadow-lg'
    }`}>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${
        isPositive === true ? 'text-green-400' : 
        isPositive === false ? 'text-red-400' : 
        'text-white'
      }`}>{value}</p>
      {change && <p className="text-sm text-gray-500">{change}</p>}
    </div>
  );
}
