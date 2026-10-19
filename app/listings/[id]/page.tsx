'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { Listing } from '@/lib/data/store';
import MandiComparisonPanel from '@/components/MandiComparisonPanel';
import TrendChart from '@/components/TrendChart';
import PriceBadge from '@/components/PriceBadge';
import MakeOfferModal from '@/components/MakeOfferModal';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Scale,
  User,
  ShieldCheck,
  Send,
  Phone,
  MessageSquare,
  Lock,
  Share2,
  CheckCircle2,
} from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t, role } = useApp();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadListing() {
      if (!params.id) return;
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setListing(data.listing);
        }
      } catch (err) {
        console.error('Failed to load listing', err);
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [params.id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-96 rounded-3xl bg-stone-200/60 dark:bg-stone-800 animate-pulse"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-2">
          {language === 'kn' ? 'ಫಸಲು ಕಂಡುಬಂದಿಲ್ಲ' : 'Listing not found'}
        </h2>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-sm text-krishi-600 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'kn' ? 'ಮಾರುಕಟ್ಟೆಗೆ ಹಿಂತಿರುಗಿ' : 'Back to Browse'}</span>
        </Link>
      </div>
    );
  }

  const commodityName = language === 'kn' ? listing.commodity_name_kn : listing.commodity_name;
  const benchmark = listing.benchmark;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? (language === 'kn' ? 'ಲಿಂಕ್ ನಕಲಾಗಿದೆ!' : 'Link Copied!') : (language === 'kn' ? 'ಹಂಚಿಕೊಳ್ಳಿ' : 'Share')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photo & Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo Card */}
          <div className="relative rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 shadow-sm aspect-4/3 sm:aspect-16/10">
            {listing.photo_url ? (
              <img
                src={listing.photo_url}
                alt={commodityName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-krishi-50 text-krishi-700 font-bold text-4xl">
                {commodityName.slice(0, 2)}
              </div>
            )}

            <div className="absolute top-4 left-4">
              <PriceBadge badge={benchmark?.badge} size="lg" />
            </div>

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-turmeric-400" />
              <span>{listing.taluk}, {listing.district}</span>
            </div>
          </div>

          {/* Title, Variety & Asking Price */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-turmeric-700 dark:text-turmeric-400">
                  {listing.variety}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
                  {commodityName}
                </h1>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-500 block">{t('pricing.askingPrice')}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-krishi-700 dark:text-krishi-400">
                    ₹{listing.asking_price}
                  </span>
                  <span className="text-sm font-semibold text-stone-500">
                    /{listing.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity and Availability Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
                <span className="text-[11px] text-stone-500 block">{language === 'kn' ? 'ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ' : 'Available Quantity'}</span>
                <span className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1 mt-0.5">
                  <Scale className="w-3.5 h-3.5 text-krishi-600" />
                  {listing.quantity} {listing.unit}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
                <span className="text-[11px] text-stone-500 block">{language === 'kn' ? 'ಕೊನೆಯ ದಿನಾಂಕ' : 'Valid Until'}</span>
                <span className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  {listing.available_until || 'Available'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-stone-500 block">{language === 'kn' ? 'ಸ್ಥಳ' : 'Taluk & Farm'}</span>
                <span className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate block mt-0.5">
                  {listing.taluk}
                </span>
              </div>
            </div>

            {/* Produce Description */}
            {listing.description && (
              <div className="pt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800">
                <p className="font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  {language === 'kn' ? 'ಫಸಲಿನ ವಿವರ:' : 'Farmer’s Note:'}
                </p>
                <p>{listing.description}</p>
              </div>
            )}
          </div>

          {/* Mandi Fair-Price Comparison Panel */}
          <MandiComparisonPanel
            benchmark={benchmark}
            askingPrice={listing.asking_price}
            unit={listing.unit}
          />
        </div>

        {/* Right Column: Trend Chart & Make Offer Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Action Box */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-lg space-y-4">
            <div>
              <span className="text-xs font-bold text-krishi-600 uppercase tracking-wider">
                {language === 'kn' ? 'ನೇರ ಖರೀದಿ' : 'Direct Trade'}
              </span>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {language === 'kn' ? 'ರೈತರಿಗೆ ಆಫರ್ ಕಳುಹಿಸಿ' : 'Connect with Farmer'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {language === 'kn'
                  ? 'ನಿಮ್ಮ ದರವನ್ನು ತಿಳಿಸಿ. ರೈತರು ಒಪ್ಪಿಕೊಂಡ ತಕ್ಷಣ ನೇರ ಕರೆ ಮತ್ತು ವಾಟ್ಸಾಪ್ ಲಭ್ಯ.'
                  : 'Propose your price and quantity. Contact details are revealed immediately upon acceptance.'}
              </p>
            </div>

            <button
              onClick={() => setIsOfferModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-krishi-600 hover:bg-krishi-700 text-white font-extrabold text-sm shadow-md shadow-krishi-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
              <span>{t('buyer.makeOffer')}</span>
            </button>

            {/* Farmer Card & Privacy Guarantee */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-krishi-100 dark:bg-krishi-900/60 text-krishi-700 dark:text-krishi-300 flex items-center justify-center font-bold text-sm">
                  {listing.farmer_name ? listing.farmer_name[0] : 'F'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {listing.farmer_name}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {listing.taluk}, {listing.district} {listing.village && `• ${listing.village}`}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-100 dark:border-stone-700 flex items-start gap-2.5 text-xs text-stone-500">
                <Lock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'kn'
                    ? 'ರೈತರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಆಫರ್ ಒಪ್ಪಿಕೊಂಡ ನಂತರ ಮಾತ್ರ ಬಹಿರಂಗಪಡಿಸಲಾಗುತ್ತದೆ (ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಗೌಪ್ಯತೆ).'
                    : 'Farmer contact details are protected and automatically revealed once an offer is accepted.'}
                </span>
              </div>
            </div>
          </div>

          {/* 30-Day Trend Chart Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm md:text-base text-stone-900 dark:text-stone-100">
                {t('buyer.priceTrend')}
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              {language === 'kn'
                ? `${benchmark?.marketName || listing.taluk} ಎಪಿಎಂಸಿ ಮಂಡಿಯ 30 ದಿನಗಳ ದರ ಏರಿಳಿತ`
                : `Daily modal wholesale trend at ${benchmark?.marketName || listing.taluk} APMC`}
            </p>

            <TrendChart
              trendData={benchmark?.trend || []}
              askingPrice={listing.asking_price}
              unit={listing.unit}
              marketName={benchmark?.marketName || listing.taluk}
            />
          </div>
        </div>
      </div>

      {/* Make Offer Modal */}
      <MakeOfferModal
        listing={listing}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSuccess={() => {
          // If buyer, navigate to my offers
          router.push('/buyer/offers');
        }}
      />
    </div>
  );
}
