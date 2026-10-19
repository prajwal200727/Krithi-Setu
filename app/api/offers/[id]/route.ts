import { NextRequest, NextResponse } from 'next/server';
import { updateOfferStatus } from '@/lib/data/store';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, counter_price } = body;

    if (!status || !['accepted', 'countered', 'declined', 'withdrawn'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid offer status' }, { status: 400 });
    }

    const updated = updateOfferStatus(params.id, status, counter_price);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, offer: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
