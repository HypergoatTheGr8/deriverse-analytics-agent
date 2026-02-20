import { useState, useEffect } from 'react';
import { fetchSimpleTransactions } from '../lib/helius';

interface Transaction {
  timestamp: string;
  type: string;
  amount: number;
  fee: number;
}

export const useTransactions = (walletAddress: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchSimpleTransactions(walletAddress);
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

  return { transactions, loading, error };
};
