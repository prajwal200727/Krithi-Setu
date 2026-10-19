/**
 * KrishiSetu Unit Conversion Module
 * Agmarknet publishes wholesale prices in Rs per Quintal (1 Quintal = 100 kg).
 * Farmers sell in kg, quintal, or piece (e.g., coconut, jackfruit).
 */

export type CommodityUnit = 'kg' | 'quintal' | 'piece';

export interface ConversionRule {
  commoditySlug: string;
  quintalToKg: number;
  quintalToPiece: number; // Approximate conversion for piece-based crops
}

export const COMMODITY_CONVERSIONS: Record<string, ConversionRule> = {
  arecanut: { commoditySlug: 'arecanut', quintalToKg: 100, quintalToPiece: 100 },
  coconut: { commoditySlug: 'coconut', quintalToKg: 100, quintalToPiece: 100 }, // 1 quintal ~ 100 mature/tender coconuts (1 kg/nut avg)
  cashew: { commoditySlug: 'cashew', quintalToKg: 100, quintalToPiece: 100 },
  pepper: { commoditySlug: 'pepper', quintalToKg: 100, quintalToPiece: 100 },
  rubber: { commoditySlug: 'rubber', quintalToKg: 100, quintalToPiece: 100 },
  banana: { commoditySlug: 'banana', quintalToKg: 100, quintalToPiece: 100 },
  jackfruit: { commoditySlug: 'jackfruit', quintalToKg: 100, quintalToPiece: 10 }, // 10-12 kg per jackfruit on avg
  brinjal: { commoditySlug: 'brinjal', quintalToKg: 100, quintalToPiece: 100 },
  ladies_finger: { commoditySlug: 'ladies_finger', quintalToKg: 100, quintalToPiece: 100 },
  cucumber: { commoditySlug: 'cucumber', quintalToKg: 100, quintalToPiece: 100 },
  pineapple: { commoditySlug: 'pineapple', quintalToKg: 100, quintalToPiece: 50 }, // 2 kg per pineapple
  mango: { commoditySlug: 'mango', quintalToKg: 100, quintalToPiece: 250 },
};

/**
 * Converts price from Rs/Quintal (Agmarknet standard) to target unit (Rs/kg or Rs/piece)
 */
export function convertMandiPriceToUnit(
  pricePerQuintal: number,
  targetUnit: CommodityUnit,
  commoditySlug: string
): number {
  if (pricePerQuintal <= 0) return 0;
  if (targetUnit === 'quintal') {
    return Math.round(pricePerQuintal);
  }

  if (targetUnit === 'kg') {
    // 1 quintal = 100 kg -> Rs/kg = Rs/quintal / 100
    const pricePerKg = pricePerQuintal / 100;
    return Number(pricePerKg.toFixed(2));
  }

  if (targetUnit === 'piece') {
    const rule = COMMODITY_CONVERSIONS[commoditySlug] || { quintalToPiece: 100 };
    const pricePerPiece = pricePerQuintal / rule.quintalToPiece;
    return Number(pricePerPiece.toFixed(2));
  }

  return pricePerQuintal;
}

/**
 * Converts asking quantity from one unit to another
 */
export function convertQuantity(
  qty: number,
  fromUnit: CommodityUnit,
  toUnit: CommodityUnit,
  commoditySlug: string
): number {
  if (fromUnit === toUnit) return qty;
  const rule = COMMODITY_CONVERSIONS[commoditySlug] || { quintalToKg: 100, quintalToPiece: 100 };

  // Normalize to kg first
  let kg = qty;
  if (fromUnit === 'quintal') {
    kg = qty * 100;
  } else if (fromUnit === 'piece') {
    kg = (qty / rule.quintalToPiece) * 100;
  }

  // Convert kg to target
  if (toUnit === 'kg') return kg;
  if (toUnit === 'quintal') return kg / 100;
  if (toUnit === 'piece') return (kg / 100) * rule.quintalToPiece;

  return qty;
}
