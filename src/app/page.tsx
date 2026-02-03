import React from 'react';
import { Grid } from '@mui/material';
import StatCard from '../components/StatCard';
import TimeAnalysis from '../components/TimeAnalysis';
import TradeHistory from '../components/TradeHistory';
import { Trade } from '../types';

interface DashboardProps {
  trades: Trade[];
}

const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const totalTrades = trades.length;
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const avgPnl = totalTrades > 0 ? totalPnl / totalTrades : 0;

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard title="Total Trades" value={totalTrades.toString()} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Total PnL" value={totalPnl.toFixed(2)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Avg PnL" value={avgPnl.toFixed(2)} />
        </Grid>
        <Grid item xs={12}>
          <TimeAnalysis trades={trades} />
        </Grid>
        <Grid item xs={12}>
          <TradeHistory trades={trades} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;