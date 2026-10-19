import { CommodityUnit, convertMandiPriceToUnit } from './unit-converter';

export type BadgeType = 'below_market' | 'fair_price' | 'above_market' | 'no_benchmark';

export interface FairPriceBadge {
  type: BadgeType;
  deltaPercent: number;
  labelEn: string;
  labelKn: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotColor: string;
}

export interface MandiRecord {
  commodity: string;
  variety: string;
  market: string;
  district: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

export interface MandiBenchmarkResult {
  marketName: string;
  district: string;
  distanceKm: number;
  benchmarkPrice: number; // 7-day median modal price in target unit
  minPrice: number;       // latest min price in target unit
  maxPrice: number;       // latest max price in target unit
  modalPrice: number;     // latest modal price in target unit
  asOfDate: string;
  isStale: boolean;
  deltaPercent?: number;
  badge?: FairPriceBadge;
  trend: Array<{
    date: string;
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
  }>;
}

/**
 * Computes median value of an array of numbers
 */
export function calculateMedian(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculates fair price badge based on delta% between asking and benchmark
 */
export function getFairPriceBadge(askingPrice: number, benchmarkPrice: number | null): FairPriceBadge {
  if (!benchmarkPrice || benchmarkPrice <= 0 || !askingPrice || askingPrice <= 0) {
    return {
      type: 'no_benchmark',
      deltaPercent: 0,
      labelEn: 'No benchmark',
      labelKn: 'ದರ ಲಭ್ಯವಿಲ್ಲ',
      bgClass: 'bg-stone-100 dark:bg-stone-800',
      textClass: 'text-stone-700 dark:text-stone-300',
      borderClass: 'border-stone-200 dark:border-stone-700',
      dotColor: 'bg-stone-400',
    };
  }

  const delta = ((askingPrice - benchmarkPrice) / benchmarkPrice) * 100;
  const roundedDelta = Math.round(delta * 10) / 10;

  if (roundedDelta <= -5) {
    return {
      type: 'below_market',
      deltaPercent: roundedDelta,
      labelEn: `Below market ${roundedDelta}%`,
      labelKn: `ಮಂಡಿಗಿಂತ ${Math.abs(roundedDelta)}% ಕಡಿಮೆ`,
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
      textClass: 'text-emerald-700 dark:text-emerald-300 font-semibold',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      dotColor: 'bg-emerald-500',
    };
  }

  if (roundedDelta > 5) {
    return {
      type: 'above_market',
      deltaPercent: roundedDelta,
      labelEn: `Above market +${roundedDelta}%`,
      labelKn: `ಮಂಡಿಗಿಂತ +${roundedDelta}% ಹೆಚ್ಚು`,
      bgClass: 'bg-amber-50 dark:bg-amber-950/40',
      textClass: 'text-amber-800 dark:text-amber-300 font-semibold',
      borderClass: 'border-amber-200 dark:border-amber-800',
      dotColor: 'bg-amber-500',
    };
  }

  return {
    type: 'fair_price',
    deltaPercent: roundedDelta,
    labelEn: 'Fair price',
    labelKn: 'ಸರಿಯಾದ ದರ',
    bgClass: 'bg-sky-50 dark:bg-sky-950/40',
    textClass: 'text-sky-700 dark:text-sky-300 font-semibold',
    borderClass: 'border-sky-200 dark:border-sky-800',
    dotColor: 'bg-sky-500',
  };
}

/**
 * Resolves the benchmark for a given crop, taluk, asking price, and unit
 */
export function computeBenchmark(
  commoditySlug: string,
  taluk: string,
  unit: CommodityUnit,
  allMandiRecords: MandiRecord[],
  askingPrice?: number
): MandiBenchmarkResult | null {
  // 1. Normalize commodity name matching
  const matchingRecords = allMandiRecords.filter(r => {
    const rComm = r.commodity.toLowerCase();
    const cSlug = commoditySlug.toLowerCase();
    return rComm.includes(cSlug) || cSlug.includes(rComm);
  });

  if (matchingRecords.length === 0) {
    return null;
  }

  // 2. Identify nearest reporting market for this commodity
  // Check if taluk matches a reporting market directly
  const talukLower = taluk.toLowerCase();
  let candidateRecords = matchingRecords.filter(r => r.market.toLowerCase() === talukLower);

  let marketName = taluk;
  let distanceKm = 0;

  if (candidateRecords.length === 0) {
    // Fall back to any market reporting in Dakshina Kannada or Udupi
    candidateRecords = matchingRecords;
    marketName = candidateRecords[0].market;
    distanceKm = marketName.toLowerCase() === 'puttur' ? 25 : 35;
  } else {
    marketName = candidateRecords[0].market;
  }

  // 3. Sort chronologically
  const sortedRecords = [...candidateRecords].sort(
    (a, b) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime()
  );

  // 4. Take the last 7 reporting records for median modal price
  const last7Records = sortedRecords.slice(0, 7);
  const modalPricesInQuintals = last7Records.map(r => r.modal_price);
  const medianModalInQuintal = calculateMedian(modalPricesInQuintals);

  const latestRecord = sortedRecords[0];
  const benchmarkPrice = convertMandiPriceToUnit(medianModalInQuintal, unit, commoditySlug);
  const minPrice = convertMandiPriceToUnit(latestRecord.min_price, unit, commoditySlug);
  const maxPrice = convertMandiPriceToUnit(latestRecord.max_price, unit, commoditySlug);
  const modalPrice = convertMandiPriceToUnit(latestRecord.modal_price, unit, commoditySlug);

  // Calculate days stale
  const latestDate = new Date(latestRecord.arrival_date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - latestDate.getTime()) / (1000 * 3600 * 24));
  const isStale = diffDays > 7;

  // 5. Build 30-day trend data (ascending order for Recharts)
  const last30Records = sortedRecords.slice(0, 30).reverse();
  const trend = last30Records.map(r => ({
    date: r.arrival_date.slice(5), // '10-19'
    modalPrice: convertMandiPriceToUnit(r.modal_price, unit, commoditySlug),
    minPrice: convertMandiPriceToUnit(r.min_price, unit, commoditySlug),
    maxPrice: convertMandiPriceToUnit(r.max_price, unit, commoditySlug),
  }));

  const result: MandiBenchmarkResult = {
    marketName,
    district: latestRecord.district,
    distanceKm,
    benchmarkPrice,
    minPrice,
    maxPrice,
    modalPrice,
    asOfDate: latestRecord.arrival_date,
    isStale,
    trend,
  };

  if (askingPrice && askingPrice > 0) {
    const badge = getFairPriceBadge(askingPrice, benchmarkPrice);
    result.badge = badge;
    result.deltaPercent = badge.deltaPercent;
  }

  return result;
}
