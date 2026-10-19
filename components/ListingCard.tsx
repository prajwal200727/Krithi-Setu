'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/lib/data/store';
import { useApp } from '@/lib/context/AppContext';
import PriceBadge from './PriceBadge';
import { MapPin, Calendar, Scale, ArrowRight, Sparkles } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { language, t } = useApp();

  const commodityName = language === 'kn' ? listing.commodity_name_kn : listing.commodity_name;
  const isDirectFarm = true;

  return (
    <div className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-card-hover hover:border-krishi-400 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Photo and Badges */}
      <div className="relative h-48 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
        {listing.photo_url ? (
          <img
            src={listing.photo_url}
            alt={listing.variety || commodityName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-krishi-50 dark:bg-stone-800 text-krishi-600 font-bold text-2xl">
            {commodityName.slice(0, 2)}
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <PriceBadge badge={listing.benchmark?.badge} size="sm" />
        </div>

        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
          <Scale className="w-3 h-3" />
          <span>{listing.quantity} {listing.unit}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 group-hover:text-krishi-600 transition-colors">
              {commodityName}
            </h3>
          </div>

          <p className="text-xs font-semibold text-turmeric-700 dark:text-turmeric-400 mb-2">
            {listing.variety}
          </p>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              ₹{listing.asking_price}
            </span>
            <span className="text-xs font-medium text-stone-500">
              /{listing.unit}
            </span>
            {listing.benchmark && (
              <span className="text-xs text-stone-400 ml-auto">
                {language === 'kn' ? 'ಮಂಡಿ:' : 'Mandi:'} ₹{listing.benchmark.benchmarkPrice}
              </span>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-1 text-xs text-stone-500 dark:text-stone-400 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-krishi-600 shrink-0" />
              <span>
                {listing.taluk}, {listing.district}
                {listing.village && ` (${listing.village})`}
              </span>
            </div>
            {listing.available_until && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>
                  {language === 'kn' ? 'ಲಭ್ಯತೆ:' : 'Available until:'} {listing.available_until}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-krishi-100 text-krishi-700 flex items-center justify-center text-xs font-bold">
              {listing.farmer_name ? listing.farmer_name[0] : 'F'}
            </div>
            <span className="text-xs text-stone-600 dark:text-stone-300 font-medium truncate max-w-[120px]">
              {listing.farmer_name}
            </span>
          </div>

          <Link
            href={`/listings/${listing.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-krishi-600 hover:text-krishi-700 dark:text-krishi-400 group-hover:translate-x-0.5 transition-transform"
          >
            <span>{language === 'kn' ? 'ವಿವರ ನೋಡಿ' : 'View & Offer'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
