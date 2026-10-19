import { NextResponse } from 'next/server';
import { getCommodities, getMarkets, getTaluks, getUsers } from '@/lib/data/store';

export async function GET() {
  try {
    const commodities = getCommodities();
    const markets = getMarkets();
    const taluks = getTaluks();
    const users = getUsers();

    return NextResponse.json({
      success: true,
      commodities,
      markets,
      taluks,
      users,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
