'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Listing } from '@/lib/data/store';
import ListingCard from '@/components/ListingCard';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Sprout } from 'lucide-react';

export default function BrowsePage() {
  const { language, t } = useApp();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [crop, setCrop] = useState('all');
  const [taluk, setTaluk] = useState('all');
  const [sort, setSort] = useState('newest');
  const [minQty, setMinQty] = useState('');

  const crops = [
    { slug: 'all', label: language === 'kn' ? 'ಎಲ್ಲಾ ಬೆಳೆಗಳು' : 'All Crops' },
    { slug: 'arecanut', label: language === 'kn' ? 'ಅಡಿಕೆ' : 'Arecanut' },
    { slug: 'coconut', label: language === 'kn' ? 'ತೆಂಗಿನಕಾಯಿ/ಎಳನೀರು' : 'Coconut' },
    { slug: 'cashew', label: language === 'kn' ? 'ಗೋಡಂಬಿ' : 'Cashew' },
    { slug: 'pepper', label: language === 'kn' ? 'ಕರಿಮೆಣಸು' : 'Black Pepper' },
    { slug: 'rubber', label: language === 'kn' ? 'ರಬ್ಬರ್' : 'Rubber Sheet' },
    { slug: 'banana', label: language === 'kn' ? 'ಬಾಳೆಹಣ್ಣು' : 'Banana' },
    { slug: 'brinjal', label: language === 'kn' ? 'ಮಟ್ಟುಗುಳ್ಳ' : 'Mattu Gulla' },
    { slug: 'cucumber', label: language === 'kn' ? 'ಸೌತೆಕಾಯಿ' : 'Cucumber' },
    { slug: 'pineapple', label: language === 'kn' ? 'ಅನಾನಸ್' : 'Pineapple' },
  ];

  const taluks = [
    { slug: 'all', label: language === 'kn' ? 'ಎಲ್ಲಾ ತಾಲೂಕುಗಳು' : 'All Taluks' },
    { slug: 'Puttur', label: 'Puttur (ಪುತ್ತೂರು)' },
    { slug: 'Mangaluru', label: 'Mangaluru (ಮಂಗಳೂರು)' },
    { slug: 'Udupi', label: 'Udupi (ಉಡುಪಿ)' },
    { slug: 'Kundapura', label: 'Kundapura (ಕುಂದಾಪುರ)' },
    { slug: 'Karkala', label: 'Karkala (ಕಾರ್ಕಳ)' },
    { slug: 'Sullia', label: 'Sullia (ಸುಳ್ಯ)' },
    { slug: 'Belthangady', label: 'Belthangady (ಬೆಳ್ತಂಗಡಿ)' },
    { slug: 'Kapu', label: 'Kapu (ಕಾಪು)' },
  ];

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (crop && crop !== 'all') params.append('crop', crop);
        if (taluk && taluk !== 'all') params.append('taluk', taluk);
        if (search) params.append('search', search);
        if (sort) params.append('sort', sort);
        if (minQty) params.append('minQty', minQty);

        const res = await fetch(`/api/listings?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setListings(data.listings);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchListings();
    }, 200);

    return () => clearTimeout(timer);
  }, [crop, taluk, search, sort, minQty]);

  const clearFilters = () => {
    setSearch('');
    setCrop('all');
    setTaluk('all');
    setSort('newest');
    setMinQty('');
  };

  const hasActiveFilters = crop !== 'all' || taluk !== 'all' || search !== '' || minQty !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          {language === 'kn' ? 'ತಾಜಾ ಕೃಷಿ ಫಸಲುಗಳ ಮಾರುಕಟ್ಟೆ' : 'Browse Produce Listings'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {language === 'kn'
            ? 'ದಕ್ಷಿಣ ಕನ್ನಡ ಮತ್ತು ಉಡುಪಿಯ ಸಣ್ಣ ರೈತರಿಂದ ನೇರವಾಗಿ ಖರೀದಿಸಿ'
            : 'Direct access to verified farmer harvests in Dakshina Kannada & Udupi with transparent APMC benchmarks.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('common.search')}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-krishi-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Taluk Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={taluk}
              onChange={e => setTaluk(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-medium text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-krishi-500"
            >
              {taluks.map(tOption => (
                <option key={tOption.slug} value={tOption.slug}>
                  {tOption.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-medium text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-krishi-500"
            >
              <option value="newest">{t('buyer.sortNewest')}</option>
              <option value="price_asc">{t('buyer.sortPriceLow')}</option>
              <option value="price_desc">{t('buyer.sortPriceHigh')}</option>
              <option value="quantity_desc">{language === 'kn' ? 'ಹೆಚ್ಚು ಪ್ರಮಾಣ ಮೊದಲು' : 'Highest Quantity'}</option>
            </select>
          </div>
        </div>

        {/* Crop Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          {crops.map(c => {
            const isSelected = crop === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setCrop(c.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-krishi-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Active Filters count & reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
            <span className="text-stone-500">
              {language === 'kn' ? `ಶೋಧನೆಯಲ್ಲಿ ${listings.length} ಫಲಿತಾಂಶಗಳು` : `Showing ${listings.length} matching harvests`}
            </span>
            <button
              onClick={clearFilters}
              className="text-krishi-600 hover:underline font-semibold"
            >
              {language === 'kn' ? 'ಎಲ್ಲಾ ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ' : 'Clear all filters'}
            </button>
          </div>
        )}
      </div>

      {/* Produce Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-stone-200/60 dark:bg-stone-800 animate-pulse"></div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
          <Sprout className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-1">
            {language === 'kn' ? 'ಯಾವುದೇ ಫಸಲು ಕಂಡುಬಂದಿಲ್ಲ' : 'No produce listings found'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            {language === 'kn'
              ? 'ದಯವಿಟ್ಟು ಬೇರೆ ತಾಲೂಕು ಅಥವಾ ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ ಪ್ರಯತ್ನಿಸಿ.'
              : 'Try clearing your search query or selecting a different crop or taluk.'}
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold text-krishi-700 bg-krishi-50 border border-krishi-200 hover:bg-krishi-100 transition-colors"
          >
            {language === 'kn' ? 'ಫಿಲ್ಟರ್ ರದ್ದುಮಾಡಿ' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
