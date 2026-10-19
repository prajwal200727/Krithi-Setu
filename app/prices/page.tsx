'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { MandiRecord } from '@/lib/pricing/benchmark';
import {
  TrendingUp,
  MapPin,
  Calendar,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

export default function MandiPricesPage() {
  const { language, t } = useApp();
  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [lastUpdated, setLastUpdated] = useState('2026-10-19');
  const [ingesting, setIngesting] = useState(false);
  const [ingestMsg, setIngestMsg] = useState('');

  const crops = [
    { slug: 'all', label: language === 'kn' ? 'ಎಲ್ಲಾ ಬೆಳೆಗಳು' : 'All Commodities' },
    { slug: 'Arecanut', label: 'Arecanut (ಅಡಿಕೆ)' },
    { slug: 'Coconut', label: 'Coconut / Tender Coconut (ತೆಂಗು/ಎಳನೀರು)' },
    { slug: 'Cashew', label: 'Cashew Raw (ಗೋಡಂಬಿ)' },
    { slug: 'Pepper', label: 'Black Pepper (ಕರಿಮೆಣಸು)' },
    { slug: 'Rubber', label: 'Rubber Sheet (ರಬ್ಬರ್)' },
    { slug: 'Banana', label: 'Banana (ಬಾಳೆಹಣ್ಣು)' },
    { slug: 'Brinjal', label: 'Mattu Gulla & Brinjal (ಮಟ್ಟುಗುಳ್ಳ)' },
    { slug: 'Cucumber', label: 'Cucumber (ಸೌತೆಕಾಯಿ)' },
    { slug: 'Pineapple', label: 'Pineapple (ಅನಾನಸ್)' },
    { slug: 'Mango', label: 'Mango (ಮಾವು)' },
  ];

  const markets = [
    { slug: 'all', label: language === 'kn' ? 'ಎಲ್ಲಾ ಎಪಿಎಂಸಿಗಳು' : 'All APMC Markets' },
    { slug: 'Puttur', label: 'Puttur APMC (ಪುತ್ತೂರು)' },
    { slug: 'Mangaluru', label: 'Mangaluru APMC (ಮಂಗಳೂರು)' },
    { slug: 'Udupi', label: 'Udupi APMC (ಉಡುಪಿ)' },
    { slug: 'Kundapura', label: 'Kundapura APMC (ಕುಂದಾಪುರ)' },
    { slug: 'Karkala', label: 'Karkala APMC (ಕಾರ್ಕಳ)' },
    { slug: 'Sullia', label: 'Sullia APMC (ಸುಳ್ಯ)' },
  ];

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCrop !== 'all') params.append('commodity', selectedCrop);
      if (selectedMarket !== 'all') params.append('market', selectedMarket);
      params.append('days', '30');

      const res = await fetch(`/api/prices?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedCrop, selectedMarket]);

  const handleIngestFeed = async () => {
    setIngesting(true);
    setIngestMsg('');
    try {
      const res = await fetch('/api/cron/ingest-prices?demo=true', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIngestMsg(
          language === 'kn'
            ? `ಎಗ್ಮಾರ್ಕ್‌ನೆಟ್ ದರಗಳು ನವೀಕೃತಗೊಂಡಿವೆ (${data.recordsIngested} ದರಗಳು)`
            : `Agmarknet feed refreshed successfully (${data.recordsIngested} rows processed)`
        );
        fetchPrices();
      }
    } catch (err) {
      setIngestMsg('Ingestion failed');
    } finally {
      setIngesting(false);
      setTimeout(() => setIngestMsg(''), 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-krishi-600 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Agmarknet (data.gov.in)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {language === 'kn' ? 'ಎಪಿಎಂಸಿ ಮಂಡಿ ದರಗಳ ತನಿಖೆ' : 'Coastal Mandi Prices Explorer'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {language === 'kn'
              ? `ದಕ್ಷಿಣ ಕನ್ನಡ ಮತ್ತು ಉಡುಪಿಯ ಅಧಿಕೃತ ಮಂಡಿ ದರಗಳು • ಕೊನೆಯ ನವೀಕರಣ: ${lastUpdated}`
              : `Official wholesale APMC arrival prices • Last updated: ${lastUpdated}`}
          </p>
        </div>

        <button
          onClick={handleIngestFeed}
          disabled={ingesting}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-50 shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${ingesting ? 'animate-spin text-krishi-600' : ''}`} />
          <span>{ingesting ? t('common.loading') : (language === 'kn' ? 'ದರ ನವೀಕರಿಸಿ' : 'Refresh Feed')}</span>
        </button>
      </div>

      {ingestMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-fade-in flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{ingestMsg}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            {language === 'kn' ? 'ಬೆಳೆ ಆಯ್ಕೆ' : 'Filter by Commodity'}
          </label>
          <select
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium"
          >
            {crops.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            {language === 'kn' ? 'ಮಂಡಿ ಮಾರುಕಟ್ಟೆ' : 'Filter by APMC Market'}
          </label>
          <select
            value={selectedMarket}
            onChange={e => setSelectedMarket(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium"
          >
            {markets.map(m => (
              <option key={m.slug} value={m.slug}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prices Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">{language === 'kn' ? 'ಬೆಳೆ & ತಳಿ' : 'Commodity & Variety'}</th>
                <th className="py-3.5 px-4">{language === 'kn' ? 'ಮಂಡಿ' : 'APMC Market'}</th>
                <th className="py-3.5 px-4">{language === 'kn' ? 'ದಿನಾಂಕ' : 'Arrival Date'}</th>
                <th className="py-3.5 px-4 text-right">{language === 'kn' ? 'ಸಾಮಾನ್ಯ ದರ (Modal)' : 'Modal Price'}</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">{language === 'kn' ? 'ಶ್ರೇಣಿ (Min - Max)' : 'Range (Min - Max)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    {t('common.loading')}
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    {language === 'kn' ? 'ಯಾವುದೇ ದರಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No records match this filter.'}
                  </td>
                </tr>
              ) : (
                records.map((r, i) => {
                  const pricePerKg = (r.modal_price / 100).toFixed(1);
                  return (
                    <tr
                      key={i}
                      className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="font-extrabold text-stone-900 dark:text-stone-100 block">
                          {r.commodity}
                        </span>
                        <span className="text-[11px] text-stone-500">{r.variety}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {r.market}
                        </span>
                        <span className="text-[11px] text-stone-400 block">{r.district}</span>
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                        {r.arrival_date}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="font-black text-krishi-700 dark:text-krishi-300 text-sm sm:text-base">
                          ₹{r.modal_price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-stone-400 block">
                          (₹{pricePerKg}/kg)
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right font-medium text-stone-700 dark:text-stone-300">
                        ₹{r.min_price} - ₹{r.max_price}
                        <span className="text-[11px] text-stone-400 block">per quintal</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
