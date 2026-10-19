import { NextRequest, NextResponse } from 'next/server';
import { getAllOffers, createOffer } from '@/lib/data/store';

export async function GET(request: NextRequest) {
  try {
    const offers = getAllOffers();
    return NextResponse.json({ success: true, count: offers.length, offers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.listing_id || !body.buyer_id || !body.offered_price || !body.quantity) {
      return NextResponse.json({ success: false, error: 'Missing required offer fields' }, { status: 400 });
    }

    const offer = createOffer(body);
    return NextResponse.json({ success: true, offer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
