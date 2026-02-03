import { Trade } from '../types';

interface DailyPerformance {
  date: string;
  pnl: number;
  tradeCount: number;
}

interface SessionPerformance {
  asian: { pnl: number; tradeCount: number };
  london: { pnl: number; tradeCount: number };
  newYork: { pnl: number; tradeCount: number };
}

interface HourlyPerformance {
  hour: number;
  avgPnl: number;
  tradeCount: number;
}

interface OrderTypeStats {
  market: { count: number; avgPnl: number };
  limit: { count: number; avgPnl: number };
}

export const calculateDailyPerformance = (trades: Trade[]): DailyPerformance[] => {
  const dailyMap: Record<string, { pnl: number; tradeCount: number }> = {};

  trades.forEach((trade) => {
    const date = new Date(trade.timestamp).toISOString().split('T')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = { pnl: 0, tradeCount: 0 };
    }
    dailyMap[date].pnl += trade.pnl;
    dailyMap[date].tradeCount += 1;
  });

  return Object.entries(dailyMap).map(([date, { pnl, tradeCount }]) => ({
    date,
    pnl,
    tradeCount,
  }));
};

export const calculateSessionPerformance = (trades: Trade[]): SessionPerformance => {
  const sessionStats = {
    asian: { pnl: 0, tradeCount: 0 },
    london: { pnl: 0, tradeCount: 0 },
    newYork: { pnl: 0, tradeCount: 0 },
  };

  trades.forEach((trade) => {
    const hour = new Date(trade.timestamp).getUTCHours();
    if (hour >= 0 && hour < 8) {
      sessionStats.asian.pnl += trade.pnl;
      sessionStats.asian.tradeCount += 1;
    } else if (hour >= 8 && hour < 16) {
      sessionStats.london.pnl += trade.pnl;
      sessionStats.london.tradeCount += 1;
    } else {
      sessionStats.newYork.pnl += trade.pnl;
      sessionStats.newYork.tradeCount += 1;
    }
  });

  return sessionStats;
};

export const calculateHourlyPerformance = (trades: Trade[]): HourlyPerformance[] => {
  const hourlyMap: Record<number, { pnl: number; tradeCount: number }> = {};

  trades.forEach((trade) => {
    const hour = new Date(trade.timestamp).getUTCHours();
    if (!hourlyMap[hour]) {
      hourlyMap[hour] = { pnl: 0, tradeCount: 0 };
    }
    hourlyMap[hour].pnl += trade.pnl;
    hourlyMap[hour].tradeCount += 1;
  });

  return Object.entries(hourlyMap).map(([hour, { pnl, tradeCount }]) => ({
    hour: parseInt(hour),
    avgPnl: pnl / tradeCount,
    tradeCount,
  }));
};

export const calculateOrderTypeStats = (trades: Trade[]): OrderTypeStats => {
  const orderTypeStats = {
    market: { count: 0, avgPnl: 0 },
    limit: { count: 0, avgPnl: 0 },
  };

  trades.forEach((trade) => {
    if (trade.orderType === 'market') {
      orderTypeStats.market.count += 1;
      orderTypeStats.market.avgPnl += trade.pnl;
    } else if (trade.orderType === 'limit') {
      orderTypeStats.limit.count += 1;
      orderTypeStats.limit.avgPnl += trade.pnl;
    }
  });

  orderTypeStats.market.avgPnl = orderTypeStats.market.count > 0 ? orderTypeStats.market.avgPnl / orderTypeStats.market.count : 0;
  orderTypeStats.limit.avgPnl = orderTypeStats.limit.count > 0 ? orderTypeStats.limit.avgPnl / orderTypeStats.limit.count : 0;

  return orderTypeStats;
};