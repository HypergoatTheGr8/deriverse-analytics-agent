import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface TradeAnnotationProps {
  tradeId: string;
  onClose: () => void;
  open: boolean;
}

const TradeAnnotation: React.FC<TradeAnnotationProps> = ({ tradeId, onClose, open }) => {
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem(`trade_note_${tradeId}`);
    if (savedNote) {
      setNote(savedNote);
    }
  }, [tradeId]);

  const handleSave = () => {
    localStorage.setItem(`trade_note_${tradeId}`, note);
    onClose();
  };

  const handleDelete = () => {
    localStorage.removeItem(`trade_note_${tradeId}`);
    setNote('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
        }}
      >
        <Typography variant="h6" gutterBottom>
          {editing ? 'Edit Note' : 'Add Note'}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add your notes here..."
          variant="outlined"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <div>
            {note && (
              <IconButton onClick={() => setEditing(!editing)} color="primary">
                <Edit />
              </IconButton>
            )}
            {note && (
              <IconButton onClick={handleDelete} color="error">
                <Delete />
              </IconButton>
            )}
          </div>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TradeAnnotation;