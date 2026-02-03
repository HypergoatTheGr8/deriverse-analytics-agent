import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { NoteAdd, Notes } from '@mui/icons-material';
import TradeAnnotation from './TradeAnnotation';
import { Trade } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const [openAnnotation, setOpenAnnotation] = useState(false);
  const [selectedTradeId, setSelectedTradeId] = useState('');

  const handleOpenAnnotation = (tradeId: string) => {
    setSelectedTradeId(tradeId);
    setOpenAnnotation(true);
  };

  const handleCloseAnnotation = () => {
    setOpenAnnotation(false);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Order Type</TableCell>
              <TableCell>PnL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{new Date(trade.timestamp).toLocaleString()}</TableCell>
                <TableCell>{trade.symbol}</TableCell>
                <TableCell>{trade.orderType}</TableCell>
                <TableCell>{trade.pnl.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenAnnotation(trade.id)}>
                    {localStorage.getItem(`trade_note_${trade.id}`) ? <Notes color="primary" /> : <NoteAdd />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TradeAnnotation
        tradeId={selectedTradeId}
        open={openAnnotation}
        onClose={handleCloseAnnotation}
      />
    </div>
  );
};

export default TradeHistory;