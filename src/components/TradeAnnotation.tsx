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
    // Sanitize input before saving
    const sanitizedNote = sanitizeInput(note);
    localStorage.setItem(`trade-note-${tradeId}`, sanitizedNote);
    onClose();
  };

  const sanitizeInput = (input: string): string => {
    // Remove potentially dangerous HTML/script tags
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim()
      .substring(0, 1000); // Limit to 1000 characters
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
          placeholder="Why entered, exit rationale, lessons learned. E.g. 'Entered on breakout; exited +3% after news; next time hold for trend.'"
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
