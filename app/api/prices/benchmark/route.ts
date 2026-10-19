import { NextRequest, NextResponse } from 'next/server';
import { getMandiRecords } from '@/lib/data/store';
import { computeBenchmark } from '@/lib/pricing/benchmark';
import { CommodityUnit } from '@/lib/pricing/unit-converter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commodity = searchParams.get('commodity') || 'arecanut';
    const taluk = searchParams.get('taluk') || 'Puttur';
    const unit = (searchParams.get('unit') || 'kg') as CommodityUnit;
    const askingPrice = searchParams.get('askingPrice') ? parseFloat(searchParams.get('askingPrice')!) : undefined;

    const mandiRecords = getMandiRecords();
    const benchmark = computeBenchmark(commodity, taluk, unit, mandiRecords, askingPrice);

    if (!benchmark) {
      return NextResponse.json({
        success: false,
        message: 'No mandi reporting data found for this commodity in coastal region.',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      benchmark,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
