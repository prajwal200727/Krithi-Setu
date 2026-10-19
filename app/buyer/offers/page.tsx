'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Offer } from '@/lib/data/store';
import {
  Inbox,
  CheckCircle2,
  Clock,
  PhoneCall,
  MessageSquare,
  Lock,
  ArrowRight,
  Sparkles,
  Store,
  MapPin,
  Scale,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BuyerOffersPage() {
  const { language, t, currentUser } = useApp();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuyerOffers = async () => {
    try {
      const res = await fetch(
        `/api/offers/mine?userId=${currentUser?.id || 'b2000000-0000-0000-0000-000000000001'}&role=buyer`
      );
      const data = await res.json();
      if (data.success) {
        setOffers(data.offers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyerOffers();
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-krishi-600 text-xs font-bold uppercase tracking-wider">
          <Store className="w-4 h-4" />
          <span>{language === 'kn' ? 'ಖರೀದಿ ಆಫರ್‌ಗಳು' : 'Buyer Offers Tracker'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
          {language === 'kn' ? 'ನನ್ನ ಕೃಷಿ ಆಫರ್‌ಗಳು' : 'My Sent Offers'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          {language === 'kn'
            ? 'ನೀವು ರೈತರಿಗೆ ಕಳುಹಿಸಿದ ಆಫರ್‌ಗಳ ಸ್ಥಿತಿ. ರೈತರು ಒಪ್ಪಿಕೊಂಡ ನಂತರ ಅವರ ದೂರವಾಣಿ ಮತ್ತು ವಾಟ್ಸಾಪ್ ಸಂಪರ್ಕ ಲಭ್ಯ.'
            : 'Track responses to your offers. Direct contact details unlock the moment a farmer accepts.'}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-40 rounded-3xl bg-stone-200/60 dark:bg-stone-800 animate-pulse"></div>
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
          <Inbox className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-1">
            {language === 'kn' ? 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಆಫರ್ ಕಳುಹಿಸಿಲ್ಲ' : 'No offers sent yet'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            {language === 'kn'
              ? 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ತಾಜಾ ಬೆಳೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ ನೇರ ಆಫರ್ ಕಳುಹಿಸಿ.'
              : 'Browse fresh harvests from DK & Udupi farmers and make your first offer.'}
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-krishi-600 text-white font-bold text-xs shadow-sm"
          >
            <span>{t('nav.browse')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map(offer => {
            const isAccepted = offer.status === 'accepted';
            const isCountered = offer.status === 'countered';
            const isPending = offer.status === 'pending';
            const isDeclined = offer.status === 'declined';

            const farmerPhone = offer.listing?.farmer_phone || '';
            const cleanPhone = farmerPhone.replace(/[^0-9]/g, '');

            return (
              <div
                key={offer.id}
                className={`bg-white dark:bg-stone-900 rounded-3xl p-6 border shadow-sm transition-all space-y-4 ${
                  isAccepted
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-50/40 to-white'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                      {offer.listing?.commodity_name || 'Produce'} ({offer.listing?.variety})
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-krishi-600" />
                      <span>
                        {offer.listing?.taluk}, {offer.listing?.district}
                      </span>
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    {isAccepted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {language === 'kn' ? 'ರೈತರು ಒಪ್ಪಿಕೊಂಡಿದ್ದಾರೆ!' : 'Accepted by Farmer!'}
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        {language === 'kn' ? 'ರೈತರ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ' : 'Pending Farmer Review'}
                      </span>
                    )}
                    {isCountered && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        {language === 'kn' ? `ರೈತರ ಹೊಸ ದರ: ₹${offer.counter_price}` : `Counter Offer: ₹${offer.counter_price}`}
                      </span>
                    )}
                    {isDeclined && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600">
                        {language === 'kn' ? 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ' : 'Declined'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Offer Numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
                  <div>
                    <span className="text-[11px] text-stone-500 block">{language === 'kn' ? 'ರೈತರ ಕೇಳಿಕೆ' : 'Asking Price'}</span>
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      ₹{offer.listing?.asking_price}/{offer.listing?.unit}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-500 block">{language === 'kn' ? 'ನಿಮ್ಮ ಆಫರ್' : 'Your Offer'}</span>
                    <span className="text-sm font-black text-krishi-700 dark:text-krishi-300">
                      ₹{offer.offered_price}/{offer.listing?.unit}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-500 block">{language === 'kn' ? 'ಪ್ರಮಾಣ' : 'Quantity'}</span>
                    <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                      {offer.quantity} {offer.listing?.unit}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-500 block">{language === 'kn' ? 'ಒಟ್ಟು ಮೌಲ್ಯ' : 'Total Deal'}</span>
                    <span className="text-sm font-black text-stone-900 dark:text-stone-100">
                      ₹{(offer.offered_price * offer.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Contact Reveal on Acceptance */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                  {isAccepted ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-100/60 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{language === 'kn' ? 'ರೈತರ ಸಂಪರ್ಕ ವಿವರ ಬಹಿರಂಗವಾಗಿದೆ:' : 'Farmer Contact Unlocked:'}</span>
                        </div>
                        <p className="text-sm font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                          {offer.listing?.farmer_name} • {farmerPhone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t('common.call')}</span>
                        </a>

                        <a
                          href={`https://wa.me/${cleanPhone}?text=Namaskara%20${offer.listing?.farmer_name},%20regarding%20your%20${offer.listing?.commodity_name}%20deal%20on%20KrishiSetu.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{t('common.whatsapp')}</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Lock className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        {language === 'kn'
                          ? 'ರೈತರು ಈ ಆಫರ್ ಅನ್ನು ಒಪ್ಪಿಕೊಂಡ ತಕ್ಷಣ ಅವರ ಮೊಬೈಲ್ ಮತ್ತು ವಾಟ್ಸಾಪ್ ಲಿಂಕ್ ಲಭ್ಯವಾಗುತ್ತದೆ.'
                          : 'Farmer direct phone and WhatsApp link will appear immediately once accepted.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
