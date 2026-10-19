'use client';

import React from 'react';
import { MandiBenchmarkResult } from '@/lib/pricing/benchmark';
import { useApp } from '@/lib/context/AppContext';
import { ShieldCheck, MapPin, Calendar, ExternalLink, AlertCircle } from 'lucide-react';
import PriceBadge from './PriceBadge';

interface MandiComparisonPanelProps {
  benchmark: MandiBenchmarkResult | null | undefined;
  askingPrice: number;
  unit: string;
}

export default function MandiComparisonPanel({
  benchmark,
  askingPrice,
  unit,
}: MandiComparisonPanelProps) {
  const { language, t } = useApp();

  if (!benchmark) {
    return (
      <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 text-sm">
        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 font-medium mb-1">
          <AlertCircle className="w-4 h-4 text-stone-500" />
          <span>{language === 'kn' ? 'ಮಂಡಿ ಮಾನದಂಡ ಲಭ್ಯವಿಲ್ಲ' : 'No Public Mandi Benchmark'}</span>
        </div>
        <p className="text-xs text-stone-500">
          {language === 'kn'
            ? 'ಈ ನಿರ್ದಿಷ್ಟ ಬೆಳೆಗೆ ಕಳೆದ 7 ದಿನಗಳಲ್ಲಿ ಹತ್ತಿರದ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಯಿಂದ ದರ ದಾಖಲಾಗಿಲ್ಲ.'
            : 'No APMC mandi reporting available for this crop in Dakshina Kannada or Udupi in the last 7 days.'}
        </p>
      </div>
    );
  }

  const { marketName, distanceKm, benchmarkPrice, minPrice, maxPrice, modalPrice, asOfDate, isStale, badge } = benchmark;

  return (
    <div className="bg-gradient-to-br from-krishi-50/60 to-white dark:from-stone-900 dark:to-stone-950 border border-krishi-200 dark:border-krishi-900/50 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-krishi-100 dark:border-stone-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-krishi-100 dark:bg-krishi-900/40 flex items-center justify-center text-krishi-700 dark:text-krishi-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base text-stone-900 dark:text-stone-100">
              {language === 'kn' ? 'ಮಂಡಿ ಬೆಲೆ ಪಾರದರ್ಶಕತೆ' : 'Mandi Fair-Price Benchmark'}
            </h3>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-krishi-600" />
                {distanceKm > 0
                  ? t('pricing.nearestMandi', { market: marketName, distance: distanceKm })
                  : `${marketName} APMC`}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {asOfDate}
              </span>
              {isStale && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-200 text-stone-700">
                  {t('badge.stale')}
                </span>
              )}
            </div>
          </div>
        </div>

        <PriceBadge badge={badge} size="lg" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-white dark:bg-stone-800/80 p-3 rounded-xl border border-stone-100 dark:border-stone-700 shadow-xs">
          <p className="text-xs text-stone-500 mb-1">{t('pricing.askingPrice')}</p>
          <p className="text-lg font-bold text-stone-900 dark:text-stone-100">
            ₹{askingPrice} <span className="text-xs font-normal text-stone-500">/{unit}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-stone-800/80 p-3 rounded-xl border border-krishi-200 dark:border-krishi-900 shadow-xs">
          <p className="text-xs text-krishi-800 dark:text-krishi-300 font-medium mb-1">
            {language === 'kn' ? '7 ದಿನಗಳ ಸರಾಸರಿ (ಮಾನದಂಡ)' : '7-Day Median Modal'}
          </p>
          <p className="text-lg font-bold text-krishi-700 dark:text-krishi-300">
            ₹{benchmarkPrice} <span className="text-xs font-normal text-stone-500">/{unit}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-stone-800/80 p-3 rounded-xl border border-stone-100 dark:border-stone-700 shadow-xs">
          <p className="text-xs text-stone-500 mb-1">{language === 'kn' ? 'ಇಂದಿನ ಸಾಮಾನ್ಯ ದರ' : 'Latest Modal'}</p>
          <p className="text-lg font-bold text-stone-800 dark:text-stone-200">
            ₹{modalPrice} <span className="text-xs font-normal text-stone-500">/{unit}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-stone-800/80 p-3 rounded-xl border border-stone-100 dark:border-stone-700 shadow-xs">
          <p className="text-xs text-stone-500 mb-1">{language === 'kn' ? 'ಮಂಡಿ ಕನಿಷ್ಠ-ಗರಿಷ್ಠ' : 'Mandi Min - Max'}</p>
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mt-1">
            ₹{minPrice} - ₹{maxPrice}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-krishi-100 dark:border-stone-800">
        <span className="flex items-center gap-1">
          {t('pricing.sourceAgmarknet')}
        </span>
        <span className="text-[11px] text-stone-400">
          {language === 'kn' ? '1 ಕ್ವಿಂಟಾಲ್ = 100 ಕೆ.ಜಿ ನಿಖರ ಪರಿವರ್ತನೆ' : 'Normalized 1 quintal = 100 kg'}
        </span>
      </div>
    </div>
  );
}
