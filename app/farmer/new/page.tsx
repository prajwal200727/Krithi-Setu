'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { CommodityUnit } from '@/lib/pricing/unit-converter';
import PriceBadge from '@/components/PriceBadge';
import { getFairPriceBadge } from '@/lib/pricing/benchmark';
import {
  Sprout,
  Check,
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NewProducePage() {
  const router = useRouter();
  const { language, t, currentUser } = useApp();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [selectedCrop, setSelectedCrop] = useState('arecanut');
  const [variety, setVariety] = useState('Chali (Supari)');
  const [quantity, setQuantity] = useState<number>(200);
  const [unit, setUnit] = useState<CommodityUnit>('kg');
  const [askingPrice, setAskingPrice] = useState<number>(480);
  const [taluk, setTaluk] = useState<string>('Puttur');
  const [village, setVillage] = useState<string>('Paduvannoor');
  const [availableUntil, setAvailableUntil] = useState<string>('2026-11-20');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=800'
  );
  const [description, setDescription] = useState<string>('');

  // Live Mandi benchmark guidance state
  const [mandiBenchmark, setMandiBenchmark] = useState<any>(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(false);

  const crops = [
    {
      slug: 'arecanut',
      name_en: 'Arecanut',
      name_kn: 'ಅಡಿಕೆ',
      varieties: ['Chali (Supari)', 'Bette', 'Koka', 'Rashi'],
      defaultUnit: 'kg' as CommodityUnit,
      defaultPhoto: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=800',
    },
    {
      slug: 'coconut',
      name_en: 'Coconut / Tender Coconut',
      name_kn: 'ತೆಂಗಿನಕಾಯಿ / ಎಳನೀರು',
      varieties: ['Tender Coconut (Bonda)', 'Mature Coconut (Naliker)', 'Copra'],
      defaultUnit: 'piece' as CommodityUnit,
      defaultPhoto: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&q=80&w=800',
    },
    {
      slug: 'cashew',
      name_en: 'Raw Cashew Nut',
      name_kn: 'ಗೋಡಂಬಿ ಕಚ್ಚಾ ಬೀಜ',
      varieties: ['Raw with shell (Local Gola)', 'Vengurla-4', 'Ullal-1'],
      defaultUnit: 'kg' as CommodityUnit,
      defaultPhoto: 'https://images.unsplash.com/photo-1563205764-79ea509639d3?auto=format&fit=crop&q=80&w=800',
    },
    {
      slug: 'pepper',
      name_en: 'Black Pepper',
      name_kn: 'ಕರಿಮೆಣಸು',
      varieties: ['Black Garbled (Panniyur-1)', 'Ungarbled'],
      defaultUnit: 'kg' as CommodityUnit,
      defaultPhoto: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800',
    },
    {
      slug: 'rubber',
      name_en: 'Natural Rubber Sheet',
      name_kn: 'ರಬ್ಬರ್ ಹಾಳೆ',
      varieties: ['RSS-4 Grade', 'RSS-5 Grade', 'Scrap Latex'],
      defaultUnit: 'kg' as CommodityUnit,
      defaultPhoto: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    },
    {
      slug: 'banana',
      name_en: 'Banana',
      name_kn: 'ಬಾಳೆಹಣ್ಣು',
      varieties: ['Elakki / Yelakki', 'Robusta', 'Nendran'],
      defaultUnit: 'kg' as CommodityUnit,
      defaultPhoto: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=800',
    },
    {
      slug: 'brinjal',
      name_en: 'Mattu Gulla & Brinjal',
      name_kn: 'ಮಟ್ಟುಗುಳ್ಳ ಬದನೆ',
      varieties: ['Mattu Gulla (GI Tagged)', 'Green Long Coastal'],
      defaultUnit: 'kg' as CommodityUnit,
      defaultPhoto: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    },
    {
      slug: 'cucumber',
      name_en: 'Mangalore Cucumber',
      name_kn: 'ಮಂಗಳೂರು ಸೌತೆಕಾಯಿ',
      varieties: ['Malabar Sambar Cucumber'],
      defaultUnit: 'kg' as CommodityUnit,
      defaultPhoto: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&q=80&w=800',
    },
    {
      slug: 'pineapple',
      name_en: 'Pineapple',
      name_kn: 'ಅನಾನಸ್',
      varieties: ['Queen', 'Kew'],
      defaultUnit: 'kg' as CommodityUnit,
      defaultPhoto: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const taluks = [
    'Puttur',
    'Mangaluru',
    'Udupi',
    'Kundapura',
    'Karkala',
    'Sullia',
    'Belthangady',
    'Moodbidri',
    'Kapu',
    'Bantwal',
    'Byndoor',
  ];

  // Fetch benchmark whenever crop, taluk, or unit changes
  useEffect(() => {
    async function loadMandiGuidance() {
      setLoadingBenchmark(true);
      try {
        const res = await fetch(
          `/api/prices/benchmark?commodity=${selectedCrop}&taluk=${taluk}&unit=${unit}`
        );
        const data = await res.json();
        if (data.success) {
          setMandiBenchmark(data.benchmark);
          // Suggest initial price if default
          if (data.benchmark.benchmarkPrice) {
            setAskingPrice(data.benchmark.benchmarkPrice);
          }
        } else {
          setMandiBenchmark(null);
        }
      } catch (err) {
        console.error('Error fetching mandi guidance', err);
      } finally {
        setLoadingBenchmark(false);
      }
    }

    loadMandiGuidance();
  }, [selectedCrop, taluk, unit]);

  const currentCropObj = crops.find(c => c.slug === selectedCrop) || crops[0];

  const handleCropSelect = (c: (typeof crops)[0]) => {
    setSelectedCrop(c.slug);
    setVariety(c.varieties[0]);
    setUnit(c.defaultUnit);
    setPhotoUrl(c.defaultPhoto);
  };

  const liveBadge = mandiBenchmark
    ? getFairPriceBadge(askingPrice, mandiBenchmark.benchmarkPrice)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        farmer_id: currentUser?.id || 'f1000000-0000-0000-0000-000000000001',
        farmer_name: currentUser?.full_name || 'Ramesh Gowda',
        farmer_phone: currentUser?.phone || '+91 90000 00001',
        commodity_id: 1,
        commodity_slug: selectedCrop,
        commodity_name: currentCropObj.name_en,
        commodity_name_kn: currentCropObj.name_kn,
        variety,
        quantity: Number(quantity),
        unit,
        asking_price: Number(askingPrice),
        taluk,
        district: taluk === 'Udupi' || taluk === 'Kundapura' || taluk === 'Karkala' || taluk === 'Kapu' || taluk === 'Byndoor' ? 'Udupi' : 'Dakshina Kannada',
        village,
        photo_url: photoUrl,
        description: description || 'Fresh harvest ready for direct pickup.',
        available_until: availableUntil,
      };

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSuccess(true);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        router.push('/farmer/listings');
      }, 2000);
    } catch (err: any) {
      alert('Error publishing produce: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-krishi-600 dark:text-krishi-400">
          {language === 'kn' ? 'ಸರಳ ಫಸಲು ಪ್ರಕಟಣೆ' : 'Farmer Quick Publish'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
          {t('farmer.quickAdd')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          {language === 'kn'
            ? 'ಸರ್ಕಾರಿ ಮಂಡಿ ದರ ಪರಿಶೀಲಿಸಿ, 60 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ನೇರ ಗ್ರಾಹಕರಿಗೆ ಪ್ರಕಟಿಸಿ'
            : 'Check today’s APMC mandi benchmark and publish in 4 simple taps.'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between px-2">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center gap-1.5 flex-1">
            <button
              type="button"
              onClick={() => s < step && setStep(s)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s === step
                  ? 'bg-krishi-600 text-white shadow-md'
                  : s < step
                  ? 'bg-krishi-100 text-krishi-700'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </button>
            <div
              className={`h-1 flex-1 rounded ${
                s < step ? 'bg-krishi-600' : 'bg-stone-200 dark:bg-stone-800'
              } ${s === 4 ? 'hidden' : 'block'}`}
            ></div>
          </div>
        ))}
      </div>

      {success ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            {language === 'kn' ? 'ಫಸಲು ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟವಾಗಿದೆ!' : 'Produce Published Successfully!'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-6">
            {t('farmer.listingSuccess')}
          </p>
          <div className="text-xs font-semibold text-krishi-600 animate-pulse">
            {language === 'kn' ? 'ನಿಮ್ಮ ಬೆಳೆ ಪಟ್ಟಿಗೆ ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ...' : 'Redirecting to My Listings...'}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-lg space-y-6">
          {/* STEP 1: Select Crop & Variety */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {t('farmer.stepCrop')}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">{t('farmer.cropPrompt')}</p>
              </div>

              {/* Crop Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {crops.map(c => {
                  const isSelected = selectedCrop === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => handleCropSelect(c)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-krishi-600 bg-krishi-50/70 dark:bg-krishi-950/40 ring-2 ring-krishi-500/20 shadow-sm'
                          : 'border-stone-200 dark:border-stone-700 hover:border-krishi-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">
                          {c.slug === 'arecanut' ? '🌴' : c.slug === 'coconut' ? '🥥' : c.slug === 'pepper' ? '🌿' : c.slug === 'rubber' ? '📜' : c.slug === 'banana' ? '🍌' : c.slug === 'brinjal' ? '🍆' : '🌾'}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-krishi-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                        {language === 'kn' ? c.name_kn : c.name_en}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Variety Select */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                  {t('farmer.varietyPrompt')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentCropObj.varieties.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVariety(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        variety === v
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-krishi-600/20"
                >
                  <span>{t('common.next')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Quantity & Unit */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {t('farmer.stepQuantity')}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">{t('farmer.qtyPrompt')}</p>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  {language === 'kn' ? 'ಪ್ರಮಾಣ ಸಂಖ್ಯೆ' : 'Quantity value'}
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={quantity}
                  onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full text-2xl font-black px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-krishi-500"
                />
              </div>

              {/* Unit Chips */}
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">
                  {t('farmer.unitPrompt')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { u: 'kg' as CommodityUnit, label: 'ಕಿ.ಗ್ರಾಂ (kg)' },
                    { u: 'quintal' as CommodityUnit, label: 'ಕ್ವಿಂಟಾಲ್ (quintal)' },
                    { u: 'piece' as CommodityUnit, label: 'ನಂಬರ್ / ಕಾಯಿ (piece)' },
                  ].map(item => (
                    <button
                      key={item.u}
                      type="button"
                      onClick={() => setUnit(item.u)}
                      className={`py-3 px-2 rounded-2xl border text-center font-bold text-xs transition-all ${
                        unit === item.u
                          ? 'border-krishi-600 bg-krishi-50 text-krishi-700 ring-2 ring-krishi-500/20'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  {t('common.back')}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs sm:text-sm shadow-md"
                >
                  <span>{t('common.next')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Price with Mandi Guidance Chip */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {t('farmer.stepPrice')}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {t('farmer.pricePrompt', { unit })}
                </p>
              </div>

              {/* Mandi Benchmark Guidance Card */}
              {mandiBenchmark ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-krishi-50 to-white dark:from-stone-800 dark:to-stone-900 border border-krishi-200 dark:border-krishi-900/60 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-krishi-800 dark:text-krishi-300 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-krishi-600" />
                      {language === 'kn' ? 'ಇಂದಿನ ಮಂಡಿ ದರ ಮಾರ್ಗದರ್ಶಿ' : 'Today’s APMC Mandi Guidance'}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {mandiBenchmark.marketName} Mandi • {mandiBenchmark.asOfDate}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-krishi-800 dark:text-krishi-300">
                      ₹{mandiBenchmark.benchmarkPrice}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">/{unit}</span>
                    <span className="text-[11px] text-stone-400 ml-1">
                      ({language === 'kn' ? '7 ದಿನಗಳ ಸರಾಸರಿ' : '7-day median'})
                    </span>
                  </div>

                  {/* "Use this price" Chip button */}
                  <button
                    type="button"
                    onClick={() => setAskingPrice(mandiBenchmark.benchmarkPrice)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-turmeric-300" />
                    <span>{t('pricing.useMandiPrice', { price: mandiBenchmark.benchmarkPrice, unit })}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-stone-100 text-stone-500 text-xs">
                  {language === 'kn' ? 'ಹತ್ತಿರದ ಮಂಡಿ ದರ ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading nearest mandi benchmark...'}
                </div>
              )}

              {/* Price Input Field */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {language === 'kn' ? `ನಿಮ್ಮ ಬೆಲೆ (₹ ಪ್ರತಿ ${unit})` : `Your Price (₹ per ${unit})`}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-lg font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={askingPrice}
                    onChange={e => setAskingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full text-2xl font-black pl-9 pr-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-krishi-500"
                  />
                </div>
              </div>

              {/* Dynamic Live Badge Preview */}
              {liveBadge && (
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                    {language === 'kn' ? 'ಖರೀದಿದಾರರಿಗೆ ಕಾಣುವ ದರ ಬ್ಯಾಡ್ಜ್:' : 'Buyer-facing Fair-Price Badge:'}
                  </span>
                  <PriceBadge badge={liveBadge} size="md" />
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  {t('common.back')}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-krishi-600 hover:bg-krishi-700 text-white font-bold text-xs sm:text-sm shadow-md"
                >
                  <span>{t('common.next')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Location, Harvest Details & Publish */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {t('farmer.stepDetails')}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {language === 'kn' ? 'ನಿಮ್ಮ ತಾಲೂಕು ಮತ್ತು ಕೊಯ್ಲಿನ ವಿವರ' : 'Taluk, farm address, and pickup date'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                    {t('farmer.talukPrompt')}
                  </label>
                  <select
                    value={taluk}
                    onChange={e => setTaluk(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-semibold"
                  >
                    {taluks.map(tOption => (
                      <option key={tOption} value={tOption}>
                        {tOption}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                    {t('farmer.villagePrompt')}
                  </label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    placeholder="e.g. Paduvannoor / Kumbra"
                    className="w-full px-3 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                    {t('farmer.availableUntil')}
                  </label>
                  <input
                    type="date"
                    required
                    value={availableUntil}
                    onChange={e => setAvailableUntil(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                    {t('farmer.photoPrompt')}
                  </label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={e => setPhotoUrl(e.target.value)}
                    placeholder="Image URL"
                    className="w-full px-3 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  {language === 'kn' ? 'ಫಸಲಿನ ಗುಣಮಟ್ಟದ ವಿವರ (ಐಚ್ಛಿಕ)' : 'Quality Notes / Batch Description'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={
                    language === 'kn'
                      ? 'ಉದಾ: ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗಿಸಿದ ಚಾಲಿ ಅಡಿಕೆ, ನೇರ ತೋಟದಿಂದ ಲಭ್ಯ.'
                      : 'e.g. Well-cured sun dried Chali arecanut, packed in 50kg bags.'
                  }
                  className="w-full px-3 py-2 text-xs rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                ></textarea>
              </div>

              {/* Summary Pill before publish */}
              <div className="p-4 rounded-2xl bg-krishi-50 dark:bg-krishi-950/40 border border-krishi-200 dark:border-krishi-900 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    {language === 'kn' ? currentCropObj.name_kn : currentCropObj.name_en} ({variety})
                  </span>
                  <span className="text-stone-500">
                    {quantity} {unit} • ₹{askingPrice}/{unit} • {taluk}
                  </span>
                </div>
                <PriceBadge badge={liveBadge} size="sm" />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  {t('common.back')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-krishi-600 hover:bg-krishi-700 text-white font-extrabold text-sm shadow-lg shadow-krishi-600/30 disabled:opacity-50 transition-all hover:scale-[1.01]"
                >
                  <Sprout className="w-4 h-4" />
                  <span>{isSubmitting ? t('common.loading') : t('farmer.publishListing')}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
