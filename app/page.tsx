'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Listing } from '@/lib/data/store';
import ListingCard from '@/components/ListingCard';
import {
  Sprout,
  TrendingUp,
  ShieldCheck,
  Zap,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const { language, t, role, loginAs } = useApp();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      try {
        const res = await fetch('/api/listings?sort=newest');
        const data = await res.json();
        if (data.success) {
          setFeaturedListings(data.listings.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load listings', err);
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, []);

  const mandiTicker = [
    { crop: language === 'kn' ? 'ಅಡಿಕೆ (ಚಾಲಿ)' : 'Arecanut (Chali)', market: 'Puttur', price: '₹485/kg', change: '+₹5' },
    { crop: language === 'kn' ? 'ಎಳನೀರು' : 'Tender Coconut', market: 'Mangaluru', price: '₹28/piece', change: '0' },
    { crop: language === 'kn' ? 'ಕರಿಮೆಣಸು' : 'Black Pepper', market: 'Sullia', price: '₹652/kg', change: '+₹12' },
    { crop: language === 'kn' ? 'ರಬ್ಬರ್ (RSS-4)' : 'Rubber (RSS-4)', market: 'Puttur', price: '₹197/kg', change: '+₹2' },
    { crop: language === 'kn' ? 'ಮಟ್ಟುಗುಳ್ಳ' : 'Mattu Gulla', market: 'Udupi', price: '₹48/kg', change: '-₹2' },
  ];

  return (
    <div className="space-y-12">
      {/* Live Mandi Ticker */}
      <div className="bg-krishi-900 text-white text-xs py-2 px-4 overflow-hidden border-b border-krishi-800">
        <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="flex items-center gap-1.5 font-bold text-turmeric-400 shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{language === 'kn' ? 'ಇಂದಿನ ಮಂಡಿ ದರಗಳು (APMC Live):' : 'Today’s APMC Mandi Rates:'}</span>
          </div>
          <div className="flex items-center gap-6 text-stone-200">
            {mandiTicker.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-medium text-stone-300">{item.crop}</span>
                <span className="text-stone-400 text-[11px]">({item.market})</span>
                <span className="font-bold text-white">{item.price}</span>
                <span className="text-emerald-400 text-[11px]">{item.change}</span>
                {idx < mandiTicker.length - 1 && <span className="text-krishi-700">|</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-3xl bg-gradient-to-br from-krishi-800 via-krishi-700 to-emerald-900 text-white p-6 sm:p-10 lg:p-14 overflow-hidden shadow-2xl">
          {/* Decorative agricultural pattern background */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-krishi-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-turmeric-500/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-turmeric-300 text-xs sm:text-sm font-semibold mb-5">
              <Sparkles className="w-4 h-4 text-turmeric-400" />
              <span>{language === 'kn' ? 'ದಕ್ಷಿಣ ಕನ್ನಡ ಮತ್ತು ಉಡುಪಿ ಕೃಷಿಕರ ವೇದಿಕೆ' : 'Dakshina Kannada & Udupi Pilot'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-4">
              {language === 'kn' ? (
                <>
                  ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ <span className="text-turmeric-400">ನೇರವಾಗಿ ಮಾರಿ</span>, ನ್ಯಾಯಯುತ ಬೆಲೆ ಪಡೆಯಿರಿ.
                </>
              ) : (
                <>
                  Sell Directly, <span className="text-turmeric-400">Zero Middlemen</span>, Fair Mandi Benchmarks.
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100 font-normal leading-relaxed mb-8 max-w-2xl">
              {language === 'kn'
                ? '60 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ಫಸಲು ಪಟ್ಟಿ ಮಾಡಿ. ಸರ್ಕಾರಿ ಎಪಿಎಂಸಿ ಮಂಡಿ ದರವನ್ನು ನೋಡಿ ನೇರವಾಗಿ ಖರೀದಿದಾರರಿಗೆ ತಲುಪಿಸಿ.'
                : 'Marginal farmers in coastal Karnataka list arecanut, coconuts, spices & vegetables in under 60 seconds with instant public Agmarknet price guidance.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/farmer/new"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-turmeric-500 hover:bg-turmeric-400 text-stone-950 font-extrabold text-sm sm:text-base shadow-lg shadow-turmeric-500/30 transition-all hover:scale-[1.02]"
              >
                <Sprout className="w-5 h-5" />
                <span>{language === 'kn' ? 'ಫಸಲು ಸೇರಿಸಿ (60 ಸೆಕೆಂಡ್)' : 'List Produce (< 60s)'}</span>
              </Link>

              <Link
                href="/browse"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/25 transition-all"
              >
                <span>{language === 'kn' ? 'ಬೆಳೆಗಳನ್ನು ನೋಡಿ' : 'Browse All Produce'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/prices"
                className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-2xl text-xs sm:text-sm text-emerald-100 hover:text-white transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-turmeric-400" />
                <span>{language === 'kn' ? 'ಮಂಡಿ ದರ ಪರಿಶೀಲಿಸಿ' : 'View Mandi Explorer'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-krishi-100 dark:bg-krishi-900/50 flex items-center justify-center text-krishi-700 dark:text-krishi-300 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
                {language === 'kn' ? '60 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ಪಟ್ಟಿ' : 'List in Under 60s'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {language === 'kn'
                  ? 'ಕೇವಲ 4 ಸುಲಭ ಹಂತಗಳು. ಕನ್ನಡದಲ್ಲಿ ದೊಡ್ಡ ಬಟನ್‌ಗಳು, ಸಂಕೀರ್ಣತೆ ಇಲ್ಲದೆ ತಕ್ಷಣ ಪ್ರಕಟಿಸಿ.'
                  : 'Minimal fields designed for low-literacy smartphones with Kannada audio chips and quick price options.'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-turmeric-100 dark:bg-turmeric-900/50 flex items-center justify-center text-turmeric-800 dark:text-turmeric-300 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
                {language === 'kn' ? 'ನ್ಯಾಯಯುತ ಮಂಡಿ ಬೆಲೆ ಬ್ಯಾಡ್ಜ್' : 'Fair-Price Transparency'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {language === 'kn'
                  ? '7 ದಿನಗಳ ಎಪಿಎಂಸಿ ಮಂಡಿ ಸರಾಸರಿಯೊಂದಿಗೆ ಬೆಲೆ ಹೋಲಿಕೆ. ಮಾರುಕಟ್ಟೆಗಿಂತ ಹೆಚ್ಚು/ಕಡಿಮೆ ಸ್ಪಷ್ಟ ಮಾಹಿತಿ.'
                  : 'Every listing features a transparent badge computed against the 7-day median modal price of the nearest APMC.'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
                {language === 'kn' ? '0% ಕಮಿಷನ್ ನೇರ ಸಂಪರ್ಕ' : '0% Commission Connect'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {language === 'kn'
                  ? 'ಆಫರ್ ಒಪ್ಪಿಕೊಂಡ ತಕ್ಷಣ ನೇರ ಕರೆ ಮತ್ತು ವಾಟ್ಸಾಪ್ ಸಂಪರ್ಕ ಲಭ್ಯ. ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲ.'
                  : 'Direct deal closing via WhatsApp & phone call once an offer is mutually agreed, keeping all margins with the farmer.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Produce Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-krishi-600 text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-4 h-4" />
              <span>{language === 'kn' ? 'ಕರಾವಳಿ ಫಸಲುಗಳು' : 'Coastal Harvests'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
              {t('buyer.exploreProduce')}
            </h2>
          </div>

          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-krishi-600 hover:text-krishi-700 dark:text-krishi-400 group"
          >
            <span>{language === 'kn' ? 'ಎಲ್ಲಾ ಬೆಳೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View all 10+ listings'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-stone-200/60 dark:bg-stone-800 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Pilot Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {language === 'kn' ? 'ದಕ್ಷಿಣ ಕನ್ನಡ ಮತ್ತು ಉಡುಪಿ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳು' : 'Covered APMC Mandis & Taluks'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">
              {language === 'kn'
                ? 'ಪುತ್ತೂರು, ಮಂಗಳೂರು, ಸುಳ್ಯ, ಬಂಟ್ವಾಳ, ಬೆಳ್ತಂಗಡಿ, ಉಡುಪಿ, ಕುಂದಾಪುರ, ಕಾರ್ಕಳ ಹಾಗೂ ಕಾಪು ಪ್ರದೇಶಗಳ ಕೃಷಿಕರಿಗೆ ವಿಶೇಷ ಆದ್ಯತೆ.'
                : 'Covering key markets across Dakshina Kannada & Udupi districts with daily feeds from Agmarknet.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {['Puttur APMC', 'Mangaluru APMC', 'Udupi APMC', 'Kundapura APMC', 'Karkala APMC', 'Sullia APMC', 'CAMPCO Benchmark'].map(
                (item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                  >
                    ✓ {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
