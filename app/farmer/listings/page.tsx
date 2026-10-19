'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Listing } from '@/lib/data/store';
import PriceBadge from '@/components/PriceBadge';
import {
  Sprout,
  PlusCircle,
  Trash2,
  CheckCircle,
  Eye,
  Calendar,
  Scale,
  MapPin,
  Inbox,
  AlertCircle,
} from 'lucide-react';

export default function MyListingsPage() {
  const { language, t, currentUser } = useApp();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    try {
      const res = await fetch('/api/listings');
      const data = await res.json();
      if (data.success) {
        // Filter for current farmer
        const myOnes = data.listings.filter(
          (l: Listing) => l.farmer_id === currentUser?.id || l.farmer_name === currentUser?.full_name
        );
        setListings(myOnes.length > 0 ? myOnes : data.listings.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [currentUser]);

  const handleMarkSold = async (id: string) => {
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sold' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchMyListings();
      }
    } catch (err) {
      alert('Error updating listing');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'kn' ? 'ಖಚಿತವಾಗಿ ಈ ಬೆಳೆಯನ್ನು ಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಹಾಕಬೇಕೆ?' : 'Are you sure you want to remove this listing?')) {
      return;
    }
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchMyListings();
      }
    } catch (err) {
      alert('Error deleting listing');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t('nav.myListings')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {language === 'kn'
              ? `${currentUser?.full_name} ಅವರ ಸಕ್ರಿಯ ಕೃಷಿ ಫಸಲುಗಳ ನಿರ್ವಹಣೆ`
              : `Manage your active harvest listings and pricing.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/farmer/offers"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-50"
          >
            <Inbox className="w-4 h-4 text-turmeric-600" />
            <span>{t('nav.offers')}</span>
          </Link>

          <Link
            href="/farmer/new"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-krishi-600 hover:bg-krishi-700 text-white font-extrabold text-xs shadow-md shadow-krishi-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('nav.addProduce')}</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-3xl bg-stone-200/60 dark:bg-stone-800 animate-pulse"></div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
          <Sprout className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-1">
            {language === 'kn' ? 'ಯಾವುದೇ ಬೆಳೆ ಪಟ್ಟಿ ಮಾಡಲಾಗಿಲ್ಲ' : 'No produce listings found'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            {language === 'kn'
              ? 'ನಿಮ್ಮ ತೋಟದ ತಾಜಾ ಫಸಲನ್ನು ಕೇವಲ 60 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ಪಟ್ಟಿ ಮಾಡಿ.'
              : 'Add your first produce to start connecting directly with buyers.'}
          </p>
          <Link
            href="/farmer/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-krishi-600 text-white font-bold text-xs shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('farmer.quickAdd')}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map(item => {
            const isSold = item.status === 'sold';
            const commodityName = language === 'kn' ? item.commodity_name_kn : item.commodity_name;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-stone-900 rounded-3xl p-5 border shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isSold
                    ? 'border-stone-200 opacity-60 bg-stone-50'
                    : 'border-stone-200 dark:border-stone-800 hover:border-krishi-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-stone-100 overflow-hidden shrink-0 relative">
                    {item.photo_url ? (
                      <img src={item.photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-krishi-700">
                        {commodityName.slice(0, 2)}
                      </div>
                    )}
                    {isSold && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
                        SOLD
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                        {commodityName}
                      </h3>
                      <span className="text-xs font-semibold text-turmeric-700">({item.variety})</span>
                      <PriceBadge badge={item.benchmark?.badge} size="sm" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        ₹{item.asking_price}/{item.unit}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5" />
                        {item.quantity} {item.unit}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.taluk}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Link
                    href={`/listings/${item.id}`}
                    className="p-2 rounded-xl text-stone-600 hover:text-krishi-600 hover:bg-stone-100 transition-colors"
                    title="View public listing"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  {!isSold && (
                    <button
                      onClick={() => handleMarkSold(item.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('farmer.markSold')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
