'use client';

import React from 'react';
import { FairPriceBadge } from '@/lib/pricing/benchmark';
import { useApp } from '@/lib/context/AppContext';
import { Info, TrendingDown, TrendingUp, CheckCircle, HelpCircle } from 'lucide-react';

interface PriceBadgeProps {
  badge?: FairPriceBadge | null;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export default function PriceBadge({ badge, size = 'md', showDetails = false }: PriceBadgeProps) {
  const { language, t } = useApp();

  if (!badge) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
        <HelpCircle className="w-3 h-3 text-stone-400" />
        {language === 'kn' ? 'ದರ ಲಭ್ಯವಿಲ್ಲ' : 'No benchmark'}
      </span>
    );
  }

  const label = language === 'kn' ? badge.labelKn : badge.labelEn;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-3.5 py-1.5 gap-2 font-semibold',
  };

  const renderIcon = () => {
    switch (badge.type) {
      case 'below_market':
        return <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'fair_price':
        return <CheckCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />;
      case 'above_market':
        return <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-stone-500 shrink-0" />;
    }
  };

  const getTooltipExplanation = () => {
    switch (badge.type) {
      case 'below_market':
        return t('pricing.priceBelowDesc', { delta: Math.abs(badge.deltaPercent) });
      case 'fair_price':
        return t('pricing.priceFairDesc');
      case 'above_market':
        return t('pricing.priceAboveDesc', { delta: badge.deltaPercent });
      default:
        return 'No APMC mandi reporting available for this crop in the 7-day window.';
    }
  };

  return (
    <div className="inline-flex flex-col group relative">
      <span
        className={`inline-flex items-center rounded-full border shadow-sm transition-all ${badge.bgClass} ${badge.textClass} ${badge.borderClass} ${sizeClasses[size]}`}
      >
        {renderIcon()}
        <span>{label}</span>
      </span>

      {showDetails && (
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-stone-400 shrink-0" />
          {getTooltipExplanation()}
        </p>
      )}
    </div>
  );
}
