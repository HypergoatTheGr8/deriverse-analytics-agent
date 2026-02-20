import { NextResponse } from 'next/server';

// Simple in-memory cache for serverless instances (per-instance)
let cache: { ts: number; data: Record<string, number> } | null = null;
const TTL_MS = 15 * 1000; // 15s cache

// Map logical symbols used in the app to CoinGecko ids
const COINGECKO_IDS: Record<string, string> = {
  SOL: 'solana',
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDC: 'usd-coin'
};

async function fetchPrices(): Promise<Record<string, number>> {
  const ids = Object.values(COINGECKO_IDS).join(',');
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
  if (!res.ok) throw new Error('CoinGecko request failed');
  const json = await res.json();
  const out: Record<string, number> = {};
  for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
    out[symbol] = (json[id] && json[id].usd) || 0;
  }
  return out;
}

export async function GET() {
  try {
    const now = Date.now();
    if (!cache || now - cache.ts > TTL_MS) {
      const data = await fetchPrices();
      cache = { ts: now, data };
    }
    return NextResponse.json({ prices: cache.data, ts: cache.ts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
