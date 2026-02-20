import { NextResponse } from 'next/server';
import { generateTradeInsight } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trades, metrics } = body || {};
    if (!trades || !metrics) {
      return NextResponse.json({ error: 'Missing trades or metrics in request body' }, { status: 400 });
    }

    const insight = await generateTradeInsight(trades, metrics);
    return NextResponse.json({ insight });
  } catch (err: any) {
    console.error('AI insights route error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
