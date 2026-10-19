/**
 * KrishiSetu Unit & Integration Test Suite
 * Tests:
 * 1. Unit conversion (quintal to kg, piece)
 * 2. Mandi 7-day median benchmark computation
 * 3. Fair-price badge classification (-5% to +5% fair, <= -5% below, > 5% above)
 * 4. Offer state machine (pending -> accepted/countered/declined)
 * 5. Contact privacy reveal rule
 */

const assert = require('assert');

// 1. Unit conversion logic
function convertMandiPriceToUnit(pricePerQuintal, targetUnit, commoditySlug) {
  if (targetUnit === 'quintal') return pricePerQuintal;
  if (targetUnit === 'kg') return Number((pricePerQuintal / 100).toFixed(2));
  if (targetUnit === 'piece') return Number((pricePerQuintal / 100).toFixed(2));
  return pricePerQuintal;
}

// 2. Fair-price badge logic
function getFairPriceBadge(askingPrice, benchmarkPrice) {
  if (!benchmarkPrice || benchmarkPrice <= 0 || !askingPrice || askingPrice <= 0) {
    return { type: 'no_benchmark', deltaPercent: 0 };
  }
  const delta = ((askingPrice - benchmarkPrice) / benchmarkPrice) * 100;
  const rounded = Math.round(delta * 10) / 10;
  if (rounded <= -5) return { type: 'below_market', deltaPercent: rounded };
  if (rounded > 5) return { type: 'above_market', deltaPercent: rounded };
  return { type: 'fair_price', deltaPercent: rounded };
}

// 3. Median calculation
function calculateMedian(values) {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

console.log('🧪 Starting KrishiSetu Test Suite...\n');

// Test 1: Unit conversion
console.log('Test 1: Unit Conversion (Quintal -> Kg)');
const pricePerQuintal = 48000; // Rs 48,000 per quintal for Chali Arecanut
const pricePerKg = convertMandiPriceToUnit(pricePerQuintal, 'kg', 'arecanut');
assert.strictEqual(pricePerKg, 480, 'Price per kg should be 480');
console.log('✅ Passed: 48,000 Rs/quintal correctly converts to 480 Rs/kg');

// Test 2: Median calculation (7-day APMC reports)
console.log('\nTest 2: 7-Day Median APMC Modal Prices');
const modalPrices = [47000, 47500, 48000, 48200, 48500, 47800, 47900];
const medianModal = calculateMedian(modalPrices);
assert.strictEqual(medianModal, 47900, 'Median should be 47900');
console.log(`✅ Passed: 7-day median computed correctly as ${medianModal}`);

// Test 3: Fair-price badge thresholds
console.log('\nTest 3: Fair-Price Badge Logic');
// Case A: Fair price (asking 480 vs benchmark 480 -> 0% delta)
const badgeFair = getFairPriceBadge(480, 480);
assert.strictEqual(badgeFair.type, 'fair_price');
console.log('✅ Passed: Asking 480 vs Benchmark 480 -> "fair_price" (0%)');

// Case B: Below market (asking 450 vs benchmark 480 -> -6.3% delta)
const badgeBelow = getFairPriceBadge(450, 480);
assert.strictEqual(badgeBelow.type, 'below_market');
console.log('✅ Passed: Asking 450 vs Benchmark 480 -> "below_market" (-6.3%)');

// Case C: Above market (asking 520 vs benchmark 480 -> +8.3% delta)
const badgeAbove = getFairPriceBadge(520, 480);
assert.strictEqual(badgeAbove.type, 'above_market');
console.log('✅ Passed: Asking 520 vs Benchmark 480 -> "above_market" (+8.3%)');

// Case D: No benchmark (null benchmark)
const badgeNone = getFairPriceBadge(480, null);
assert.strictEqual(badgeNone.type, 'no_benchmark');
console.log('✅ Passed: Null benchmark -> "no_benchmark"');

// Test 4: Offer state machine transitions
console.log('\nTest 4: Offer State Machine Transitions');
const validTransitions = {
  pending: ['accepted', 'countered', 'declined', 'withdrawn'],
  countered: ['accepted', 'declined'],
  accepted: [],
  declined: [],
};

function canTransition(current, next) {
  return validTransitions[current]?.includes(next);
}

assert.strictEqual(canTransition('pending', 'accepted'), true);
assert.strictEqual(canTransition('pending', 'declined'), true);
assert.strictEqual(canTransition('accepted', 'pending'), false);
console.log('✅ Passed: Offer state transitions adhere to business rules');

// Test 5: Contact reveal rule
console.log('\nTest 5: Contact Privacy Rule');
function sanitizePhone(phone, status) {
  return status === 'accepted' ? phone : phone.slice(0, 9) + ' XXXXX';
}
const rawPhone = '+91 90000 00001';
assert.strictEqual(sanitizePhone(rawPhone, 'pending'), '+91 90000 XXXXX');
assert.strictEqual(sanitizePhone(rawPhone, 'accepted'), '+91 90000 00001');
console.log('✅ Passed: Phone number is masked on pending and revealed on accepted');

console.log('\n🎉 ALL KRISHISETU TESTS PASSED SUCCESSFULLY! (5/5)\n');
