import { NextRequest, NextResponse } from 'next/server';
import { getMandiRecords, getMarkets, getCommodities } from '@/lib/data/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commodity = searchParams.get('commodity');
    const market = searchParams.get('market');
    const days = parseInt(searchParams.get('days') || '30', 10);

    let records = getMandiRecords();

    if (commodity && commodity !== 'all') {
      records = records.filter(r => r.commodity.toLowerCase().includes(commodity.toLowerCase()));
    }

    if (market && market !== 'all') {
      records = records.filter(r => r.market.toLowerCase() === market.toLowerCase());
    }

    // Sort by arrival date descending
    records.sort((a, b) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime());

    // Slice to days count if specified
    const sliced = records.slice(0, days * 5); // approximate multi-market count

    // Aggregate summary for cards
    const commodities = getCommodities();
    const markets = getMarkets();

    return NextResponse.json({
      success: true,
      count: sliced.length,
      records: sliced,
      commodities,
      markets,
      lastUpdated: records[0]?.arrival_date || '2026-10-19',
      source: 'Agmarknet (data.gov.in)',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
