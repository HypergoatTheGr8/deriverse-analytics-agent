'use client';

import { useState, useEffect } from 'react';

interface TradeAnnotationProps {
  tradeId: string;
  isOpen: boolean;
  onClose: () => void;
  existingNote?: string;
}

export function TradeAnnotation({ tradeId, isOpen, onClose, existingNote }: TradeAnnotationProps) {
  const [note, setNote] = useState(existingNote || '');

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(`trade-note-${tradeId}`);
      if (saved) setNote(saved);
    }
  }, [isOpen, tradeId]);

  const handleSave = () => {
    localStorage.setItem(`trade-note-${tradeId}`, note);
    onClose();
  };

  const handleDelete = () => {
    localStorage.removeItem(`trade-note-${tradeId}`);
    setNote('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">Trade Annotation</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add notes about this trade..."
          className="w-full h-32 bg-gray-700 text-white rounded p-3 mb-4 resize-none"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-400 hover:text-red-300"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
