import { NextRequest, NextResponse } from 'next/server';
import { getAllOffers } from '@/lib/data/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'f1000000-0000-0000-0000-000000000001';
    const role = (searchParams.get('role') || 'farmer') as 'farmer' | 'buyer';

    const allOffers = getAllOffers();

    let userOffers = [];
    if (role === 'farmer') {
      userOffers = allOffers.filter(o => o.listing?.farmer_id === userId);
    } else {
      userOffers = allOffers.filter(o => o.buyer_id === userId);
    }

    // Contact Privacy Rule:
    // Only reveal phone number if offer is 'accepted'
    const sanitizedOffers = userOffers.map(offer => {
      const isAccepted = offer.status === 'accepted';
      const sanitized = { ...offer };

      if (!isAccepted) {
        if (sanitized.buyer_phone) {
          sanitized.buyer_phone = sanitized.buyer_phone.slice(0, 7) + 'XXXXX';
        }
        if (sanitized.listing && sanitized.listing.farmer_phone) {
          sanitized.listing = {
            ...sanitized.listing,
            farmer_phone: sanitized.listing.farmer_phone.slice(0, 7) + 'XXXXX',
          };
        }
      }

      return sanitized;
    });

    return NextResponse.json({
      success: true,
      count: sanitizedOffers.length,
      offers: sanitizedOffers,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
