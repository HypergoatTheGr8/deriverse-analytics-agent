'use client';
import { useState } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  description?: string;
  gradient?: string;
  compact?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  description, 
  gradient = 'from-blue-400 to-cyan-600',
  compact = false 
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getChangeColor = (changeValue: number) => {
    if (changeValue > 0) return 'text-green-600';
    if (changeValue < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (changeValue: number) => {
    if (changeValue > 0) return '↗';
    if (changeValue < 0) return '↘';
    return '→';
  };

  const formatChange = (changeValue: number) => {
    if (changeValue > 0) return `+${changeValue.toFixed(2)}`;
    if (changeValue < 0) return changeValue.toFixed(2);
    return '0.00';
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl p-6 
        transition-all duration-300 ease-out
        ${compact ? 'h-28' : 'h-36'}
        ${isHovered ? 'scale-105 shadow-2xl' : 'shadow-lg'}
        bg-gray-800 border border-gray-700
        hover:border-gray-600
        cursor-pointer
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient background on hover */}
      <div 
        className={`
          absolute inset-0 opacity-0 transition-opacity duration-500
          ${isHovered ? 'opacity-5' : 'opacity-0'}
          bg-gradient-to-br ${gradient}
        `}
      />
      
      {/* Glow effect */}
      <div 
        className={`
          absolute -inset-1 opacity-0 blur-xl transition-opacity duration-500
          ${isHovered ? 'opacity-30' : 'opacity-0'}
          bg-gradient-to-br ${gradient}
        `}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-400 font-medium text-sm tracking-wide uppercase">
            {title}
          </h3>
          {change !== undefined && (
            <span className={`text-xs font-semibold ${getChangeColor(change)}`}>
              {getChangeIcon(change)} {formatChange(change)}
            </span>
          )}
        </div>
        
        <div className={`font-bold ${compact ? 'text-2xl' : 'text-3xl'} mb-2`}>
          <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </span>
        </div>
        
        {description && (
          <p className="text-gray-300 text-sm leading-tight">
            {description}
          </p>
        )}
        
        {/* Animated underline */}
        <div className="mt-4">
          <div className="h-0.5 w-full bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`
                h-full bg-gradient-to-r ${gradient} 
                transition-transform duration-700 ease-out
                ${isHovered ? 'translate-x-0' : '-translate-x-full'}
              `}
            />
          </div>
        </div>
      </div>
      
      {/* Floating particles animation */}
      {isHovered && (
        <>
          <div 
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-30"
            style={{
              top: '20%',
              left: '10%',
              animation: 'float 3s infinite ease-in-out'
            }}
          />
          <div 
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20"
            style={{
              top: '60%',
              left: '80%',
              animation: 'float 4s infinite ease-in-out 0.5s'
            }}
          />
        </>
      )}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}