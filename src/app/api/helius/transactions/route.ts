import { NextResponse } from 'next/server';
import { fetchTradesForWallet } from '@/lib/helius';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const wallet = url.searchParams.get('wallet');
    if (!wallet) return NextResponse.json({ error: 'wallet query parameter is required' }, { status: 400 });

    const trades = await fetchTradesForWallet(wallet);
    return NextResponse.json(trades);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
