import { NextRequest, NextResponse } from 'next/server';
import { getAllListings, createListing } from '@/lib/data/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const crop = searchParams.get('crop');
    const taluk = searchParams.get('taluk');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const minQty = searchParams.get('minQty') ? parseFloat(searchParams.get('minQty')!) : null;
    const search = searchParams.get('search')?.toLowerCase();
    const sort = searchParams.get('sort') || 'newest';

    let listings = getAllListings();

    // Filters
    if (crop && crop !== 'all') {
      listings = listings.filter(l => l.commodity_slug.toLowerCase() === crop.toLowerCase());
    }

    if (taluk && taluk !== 'all') {
      listings = listings.filter(l => l.taluk.toLowerCase() === taluk.toLowerCase());
    }

    if (minPrice !== null && !isNaN(minPrice)) {
      listings = listings.filter(l => l.asking_price >= minPrice);
    }

    if (maxPrice !== null && !isNaN(maxPrice)) {
      listings = listings.filter(l => l.asking_price <= maxPrice);
    }

    if (minQty !== null && !isNaN(minQty)) {
      listings = listings.filter(l => l.quantity >= minQty);
    }

    if (search) {
      listings = listings.filter(l => 
        l.commodity_name.toLowerCase().includes(search) ||
        l.commodity_name_kn.toLowerCase().includes(search) ||
        l.variety.toLowerCase().includes(search) ||
        l.taluk.toLowerCase().includes(search) ||
        (l.village && l.village.toLowerCase().includes(search))
      );
    }

    // Sort
    if (sort === 'price_asc') {
      listings.sort((a, b) => a.asking_price - b.asking_price);
    } else if (sort === 'price_desc') {
      listings.sort((a, b) => b.asking_price - a.asking_price);
    } else if (sort === 'quantity_desc') {
      listings.sort((a, b) => b.quantity - a.quantity);
    } else {
      // Default: newest first
      listings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return NextResponse.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.commodity_slug || !body.quantity || !body.asking_price || !body.taluk) {
      return NextResponse.json({ success: false, error: 'Missing required produce fields' }, { status: 400 });
    }

    const newListing = createListing(body);
    return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
