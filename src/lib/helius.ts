import axios from 'axios';
import { Connection, PublicKey } from '@solana/web3.js';
import { Trade } from '@/types/trade';
import { getCachedPrice, setCachedPrice } from './priceCache';

const HELIUS_API_URL = 'https://api.helius.xyz/v0';
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';

// Create connection with fallback
const connection = new Connection(SOLANA_RPC_URL);

interface HeliusTransaction {
  signature: string;
  timestamp: string;
  type: string;
  fee: number;
  instructions: Array<{
    programId: string;
    programName: string;
    accounts: Array<{ name?: string; address: string }>;
    data: string;
  }>;
  tokenTransfers?: Array<{
    fromTokenAccount: string;
    toTokenAccount: string;
    fromUserAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    mint: string;
    tokenStandard: string;
  }>;
}

export const fetchWalletTransactions = async (walletAddress: string): Promise<HeliusTransaction[]> => {
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
  if (!HELIUS_API_KEY) {
    throw new Error('HELIUS_API_KEY is not configured. Please add it to your environment (for example: Vercel Project Settings -> Environment Variables).');
  }

  try {
    const response = await axios.get(`${HELIUS_API_URL}/addresses/${walletAddress}/transactions`, {
      params: {
        'api-key': HELIUS_API_KEY,
        limit: 50,
        type: 'SWAP,TRANSFER'
      }
    });

    return response.data || [];
  } catch (error: any) {
    console.error('Helius API failed:', error?.message || error);
    throw new Error(`Failed to fetch transactions: ${error?.message || error}`);
  }
};

// Return a simplified transaction list for UI hooks
export const fetchSimpleTransactions = async (walletAddress: string) => {
  const raw = await fetchWalletTransactions(walletAddress);
  const simplified = raw.map(tx => {
    let amount = 0;
    if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
      for (const t of tx.tokenTransfers) {
        if (t.toUserAccount === walletAddress) amount += Number(t.tokenAmount || 0);
        if (t.fromUserAccount === walletAddress) amount -= Number(t.tokenAmount || 0);
      }
    }
    return {
      timestamp: tx.timestamp,
      type: tx.type,
      amount,
      fee: tx.fee || 0
    };
  });

  return simplified;
};

// Helper: map token mint to CoinGecko id
function getCoinGeckoIdForMint(mint: string): string | null {
  const map: Record<string, string> = {
    'So11111111111111111111111111111111111111112': 'solana',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'usd-coin',
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'tether',
    '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs': 'ethereum',
    '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh': 'bitcoin',
    '4k3Dyjzvzp8e2WQJdH2o3G6q7g6zP6Y8b2rGHm6j3Kq': 'raydium',
    'JUPKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX': 'jupiter',
    'DezZzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz': 'bonk'
  };

  return map[mint] || null;
}

async function fetchHistoricalPriceUSD(coinId: string, timestamp: number): Promise<number> {
  const date = new Date(timestamp);
  const dateStr = `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${date.getFullYear()}`; // dd-mm-yyyy

  // Try persistent cache first
  try {
    const cached = await getCachedPrice(coinId, dateStr);
    if (typeof cached === 'number') return cached;
  } catch (err) {
    // ignore cache errors
  }

  try {
    const resp = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/history`, {
      params: { date: dateStr }
    });
    const price = resp.data?.market_data?.current_price?.usd;
    if (typeof price === 'number') {
      try { await setCachedPrice(coinId, dateStr, price); } catch (e) {}
      return price;
    }
  } catch (err: any) {
    console.warn('CoinGecko history fetch failed for', coinId, dateStr, err?.message || err);
  }

  // Fallbacks for stablecoins / unknown: assume $1 for stablecoins, otherwise 0
  if (coinId === 'usd-coin' || coinId === 'tether') {
    try { await setCachedPrice(coinId, dateStr, 1); } catch (e) {}
    return 1;
  }

  try { await setCachedPrice(coinId, dateStr, 0); } catch (e) {}
  return 0;
}

export const parseTransactionsToTrades = async (transactions: HeliusTransaction[], walletAddress: string): Promise<Trade[]> => {
  const trades: Trade[] = [];

  for (const tx of transactions) {
    // Look for Jupiter swap transactions
    if (tx.type === 'SWAP' && tx.tokenTransfers && tx.tokenTransfers.length >= 2) {
      const transfers = tx.tokenTransfers;

      // Find input and output transfers
      const inputTransfer = transfers.find(t => t.fromUserAccount === walletAddress);
      const outputTransfer = transfers.find(t => t.toUserAccount === walletAddress);

      if (inputTransfer && outputTransfer) {
        // Calculate PnL based on token amounts and historical USD prices
        const entryAmount = inputTransfer.tokenAmount;
        const exitAmount = outputTransfer.tokenAmount;
        const entryMint = inputTransfer.mint;
        const exitMint = outputTransfer.mint;

        const entryCoinId = getCoinGeckoIdForMint(entryMint);
        const exitCoinId = getCoinGeckoIdForMint(exitMint);

        const entryPriceUSD = entryCoinId ? await fetchHistoricalPriceUSD(entryCoinId, new Date(tx.timestamp).getTime()) : 0;
        const exitPriceUSD = exitCoinId ? await fetchHistoricalPriceUSD(exitCoinId, new Date(tx.timestamp).getTime()) : 0;

        const entryValueUSD = entryAmount * entryPriceUSD;
        const exitValueUSD = exitAmount * exitPriceUSD;

        const pnlUSD = exitValueUSD - entryValueUSD;

        // Fee: Helius returns fee in lamports; convert to SOL and then to USD
        const feeSOL = (tx.fee || 0) / 1_000_000_000;
        const solPriceUSD = await fetchHistoricalPriceUSD('solana', new Date(tx.timestamp).getTime());
        const feeUSD = feeSOL * solPriceUSD;

        trades.push({
          id: tx.signature,
          symbol: `${getTokenSymbol(entryMint)}/${getTokenSymbol(exitMint)}`,
          action: pnlUSD > 0 ? 'long' : 'short',
          isLong: pnlUSD > 0,
          entryPrice: entryPriceUSD,
          exitPrice: exitPriceUSD,
          size: Math.abs(entryAmount),
          fee: feeUSD,
          pnl: pnlUSD,
          timestamp: new Date(tx.timestamp).getTime(),
          entryTime: new Date(tx.timestamp).getTime(),
          exitTime: new Date(tx.timestamp).getTime() + 60000, // Assume 1 minute trade
          orderType: 'market'
        });
      }
    }
  }

  return trades;
};

// Helper function to get token symbols (simplified)
function getTokenSymbol(mintAddress: string): string {
  const tokenMap: Record<string, string> = {
    'So11111111111111111111111111111111111111112': 'SOL',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
    '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs': 'ETH',
    '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh': 'BTC',
  };
  
  return tokenMap[mintAddress] || mintAddress.slice(0, 4).toUpperCase();
}

export const fetchTradesForWallet = async (walletAddress: string): Promise<Trade[]> => {
  try {
    const transactions = await fetchWalletTransactions(walletAddress);
    const trades = await parseTransactionsToTrades(transactions, walletAddress);
    // If no trades found from Helius, attempt to parse on-chain via RPC as a fallback
    if (trades.length === 0) {
      try {
        const rpcTrades = await fetchTradesFromRpc(walletAddress);
        if (rpcTrades.length > 0) return rpcTrades;
      } catch (e) {
        console.warn('RPC fallback failed:', (e as any)?.message || e);
      }
    }
    return trades;
    } catch (error) {
    console.error('Error fetching trades:', error);
    // On error, attempt RPC fallback before giving up
    try {
      const rpcTrades = await fetchTradesFromRpc(walletAddress);
      return rpcTrades;
    } catch (e) {
      console.error('RPC fallback also failed:', (e as any)?.message || e);
      return [];
    }
  }
};

// Attempt to extract trades directly from Solana RPC parsed transactions
async function fetchTradesFromRpc(walletAddress: string): Promise<Trade[]> {
  const trades: Trade[] = [];
  try {
    const pub = new PublicKey(walletAddress);
    const sigs = await connection.getSignaturesForAddress(pub, { limit: 200 });

    for (const s of sigs) {
      try {
        const tx = await connection.getParsedTransaction(s.signature, 'confirmed');
        if (!tx) continue;
        const blockTime = (tx.blockTime || Date.now() / 1000) * 1000;

        const pre = tx.meta?.preTokenBalances || [];
        const post = tx.meta?.postTokenBalances || [];

        // Map mint -> delta for this wallet
        const deltas: Record<string, number> = {};

        const collect = (arr: any[], sign: number) => {
          for (const p of arr) {
            try {
              if (!p?.owner) continue;
              if (p.owner !== walletAddress) continue;
              const mint = p.mint as string;
              const amt = Number(p.uiTokenAmount?.uiAmount || 0) || Number(p.uiTokenAmount?.amount || 0) / Math.pow(10, p.uiTokenAmount?.decimals || 0);
              deltas[mint] = (deltas[mint] || 0) + sign * amt;
            } catch (e) { continue; }
          }
        };

        collect(post, +1);
        collect(pre, -1);

        const mintKeys = Object.keys(deltas);
        if (mintKeys.length === 0) continue;

        // If multiple mints changed, try to pair negative -> positive as swaps
        const positives = mintKeys.filter(m => deltas[m] > 0);
        const negatives = mintKeys.filter(m => deltas[m] < 0);

        if (positives.length > 0 && negatives.length > 0) {
          for (const inMint of negatives) {
            for (const outMint of positives) {
              const inAmt = Math.abs(deltas[inMint]);
              const outAmt = Math.abs(deltas[outMint]);
              const inCoinId = getCoinGeckoIdForMint(inMint);
              const outCoinId = getCoinGeckoIdForMint(outMint);
              const inPrice = inCoinId ? await fetchHistoricalPriceUSD(inCoinId, blockTime) : 0;
              const outPrice = outCoinId ? await fetchHistoricalPriceUSD(outCoinId, blockTime) : 0;

              const pnlUSD = outAmt * outPrice - inAmt * inPrice;

              // Fee
              const feeSOL = (tx.meta?.fee || 0) / 1_000_000_000;
              const solPriceUSD = await fetchHistoricalPriceUSD('solana', blockTime);
              const feeUSD = feeSOL * solPriceUSD;

              trades.push({
                id: `${s.signature}-${inMint}-${outMint}`,
                symbol: `${getTokenSymbol(inMint)}/${getTokenSymbol(outMint)}`,
                action: pnlUSD > 0 ? 'long' : 'short',
                isLong: pnlUSD > 0,
                entryPrice: inPrice,
                exitPrice: outPrice,
                size: Math.max(inAmt, outAmt),
                fee: feeUSD,
                pnl: pnlUSD,
                timestamp: blockTime,
                entryTime: blockTime,
                exitTime: blockTime,
                orderType: 'market'
              });
            }
          }
        } else {
          // Single-sided transfers (deposits/withdrawals) - represent as simple transfers
          for (const m of mintKeys) {
            const amt = deltas[m];
            const coinId = getCoinGeckoIdForMint(m);
            const price = coinId ? await fetchHistoricalPriceUSD(coinId, blockTime) : 0;
            const valueUSD = amt * price;
              trades.push({
              id: `${s.signature}-${m}`,
              symbol: `${getTokenSymbol(m)}/USD`,
              action: amt > 0 ? 'receive' : 'send',
              isLong: amt > 0,
              entryPrice: price,
              exitPrice: price,
              size: Math.abs(amt),
              fee: 0,
              pnl: valueUSD,
              timestamp: blockTime,
              entryTime: blockTime,
              exitTime: blockTime,
                orderType: 'market'
            });
          }
        }
      } catch (e) {
        continue;
      }
    }

    // Sort by most recent
    return trades.sort((a, b) => b.entryTime - a.entryTime);
  } catch (err) {
    console.error('fetchTradesFromRpc error', (err as any)?.message || err);
    return [];
  }
}


