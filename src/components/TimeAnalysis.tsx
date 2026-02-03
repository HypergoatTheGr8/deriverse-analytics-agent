import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { calculateHourlyPerformance, calculateSessionPerformance } from '../lib/timeAnalysis';
import { Trade } from '../types';

interface TimeAnalysisProps {
  trades: Trade[];
}

const TimeAnalysis: React.FC<TimeAnalysisProps> = ({ trades }) => {
  const hourlyPerformance = calculateHourlyPerformance(trades);
  const sessionPerformance = calculateSessionPerformance(trades);

  return (
    <div style={{ backgroundColor: '#121212', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h5" gutterBottom style={{ color: '#fff' }}>
        Time Analysis
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card style={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom style={{ color: '#fff' }}>
                Hourly Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="hour" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: 'none', color: '#fff' }} />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Bar dataKey="avgPnl" fill="#8884d8" name="Average PnL" />
                  <Bar dataKey="tradeCount" fill="#82ca9d" name="Trade Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom style={{ color: '#fff' }}>
                Session Breakdown
              </Typography>
              <div style={{ marginBottom: '16px' }}>
                <Typography variant="subtitle1" style={{ color: '#fff' }}>Asian Session</Typography>
                <Typography variant="body2" style={{ color: '#aaa' }}>
                  PnL: {sessionPerformance.asian.pnl.toFixed(2)} | Trades: {sessionPerformance.asian.tradeCount}
                </Typography>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Typography variant="subtitle1" style={{ color: '#fff' }}>London Session</Typography>
                <Typography variant="body2" style={{ color: '#aaa' }}>
                  PnL: {sessionPerformance.london.pnl.toFixed(2)} | Trades: {sessionPerformance.london.tradeCount}
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle1" style={{ color: '#fff' }}>New York Session</Typography>
                <Typography variant="body2" style={{ color: '#aaa' }}>
                  PnL: {sessionPerformance.newYork.pnl.toFixed(2)} | Trades: {sessionPerformance.newYork.tradeCount}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default TimeAnalysis;