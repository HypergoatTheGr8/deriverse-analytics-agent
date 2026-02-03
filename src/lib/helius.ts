import axios from 'axios';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || 'your_helius_api_key_placeholder';
const HELIUS_API_URL = 'https://api.helius.xyz/v0/transactions';
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';

interface Transaction {
  timestamp: string;
  type: string;
  amount: number;
  fee: number;
}

export const fetchWalletTransactions = async (walletAddress: string): Promise<Transaction[]> => {
  try {
    // Try Helius Enhanced Transactions API first
    const response = await axios.get(`${HELIUS_API_URL}?address=${walletAddress}`, {
      headers: { 'Authorization': `Bearer ${HELIUS_API_KEY}` }
    });

    // Parse Helius response
    return response.data.transactions.map((tx: any) => ({
      timestamp: tx.timestamp,
      type: tx.type,
      amount: tx.amount,
      fee: tx.fee
    }));
  } catch (error) {
    console.error('Helius API failed, falling back to Solana RPC:', error);
    
    // Fallback to Solana RPC
    const rpcResponse = await axios.post(SOLANA_RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getConfirmedSignaturesForAddress2',
      params: [walletAddress, { limit: 10 }]
    });

    // Parse Solana RPC response (simplified for example)
    return rpcResponse.data.result.map((tx: any) => ({
      timestamp: new Date(tx.blockTime * 1000).toISOString(),
      type: 'transfer',
      amount: 0, // Placeholder; actual parsing would require additional RPC calls
      fee: tx.fee || 0
    }));
  }
};
