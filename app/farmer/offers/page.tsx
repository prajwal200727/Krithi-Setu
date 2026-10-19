'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Offer } from '@/lib/data/store';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  PhoneCall,
  MessageSquare,
  Lock,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Building,
  User,
  Scale,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FarmerOffersPage() {
  const { language, t, currentUser } = useApp();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterModalOffer, setCounterModalOffer] = useState<Offer | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);

  const fetchOffers = async () => {
    try {
      const res = await fetch(
        `/api/offers/mine?userId=${currentUser?.id || 'f1000000-0000-0000-0000-000000000001'}&role=farmer`
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
    fetchOffers();
  }, [currentUser]);

  const handleUpdateStatus = async (offerId: string, status: Offer['status'], counter?: number) => {
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, counter_price: counter }),
      });
      const data = await res.json();
      if (data.success) {
        if (status === 'accepted') {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
        fetchOffers();
      }
    } catch (err) {
      alert('Error updating offer');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-krishi-600 text-xs font-bold uppercase tracking-wider">
          <Inbox className="w-4 h-4" />
          <span>{language === 'kn' ? 'ನೇರ ವಹಿವಾಟು' : 'Farmer Deals'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
          {t('farmer.inboxTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          {language === 'kn'
            ? 'ಖರೀದಿದಾರರಿಂದ ಬಂದ ದರ ಪ್ರಸ್ತಾಪಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ಒಪ್ಪಿಕೊಂಡ ತಕ್ಷಣ ಅವರ ದೂರವಾಣಿ ಸಂಖ್ಯೆ ಲಭ್ಯ.'
            : 'Review buyer offers. Accepting instantly reveals full contact information for direct trade.'}
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
            {language === 'kn' ? 'ಯಾವುದೇ ಹೊಸ ಆಫರ್‌ಗಳು ಬಂದಿಲ್ಲ' : 'No incoming offers yet'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            {language === 'kn'
              ? 'ಖರೀದಿದಾರರು ನಿಮ್ಮ ಬೆಳೆ ಪಟ್ಟಿಯನ್ನು ವೀಕ್ಷಿಸಿ ಆಫರ್ ಕಳುಹಿಸಿದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.'
              : 'As buyers browse your produce and make offers, they will appear here.'}
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-krishi-700 bg-krishi-50 border border-krishi-200"
          >
            <span>{t('nav.browse')}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map(offer => {
            const isAccepted = offer.status === 'accepted';
            const isCountered = offer.status === 'countered';
            const isDeclined = offer.status === 'declined';
            const isPending = offer.status === 'pending';

            const cleanPhone = offer.buyer_phone.replace(/[^0-9]/g, '');

            return (
              <div
                key={offer.id}
                className={`bg-white dark:bg-stone-900 rounded-3xl p-6 border shadow-sm transition-all space-y-4 ${
                  isAccepted
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-50/40 to-white dark:from-emerald-950/20'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* Header: Buyer info & Status */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-turmeric-100 text-turmeric-800 flex items-center justify-center font-bold text-sm">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                        {offer.buyer_name}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {offer.buyer_business || 'Agro Merchant'}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isAccepted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {language === 'kn' ? 'ಒಪ್ಪಿಕೊಳ್ಳಲಾಗಿದೆ' : 'Deal Accepted'}
                      </span>
                    )}
                    {isCountered && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        {language === 'kn' ? `ಪ್ರತಿ ದರ: ₹${offer.counter_price}` : `Countered: ₹${offer.counter_price}`}
                      </span>
                    )}
                    {isDeclined && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600">
                        {language === 'kn' ? 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ' : 'Declined'}
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                        {language === 'kn' ? 'ಹೊಸ ಆಫರ್' : 'Pending Offer'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Offer Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
                  <div>
                    <span className="text-[11px] text-stone-500 block">
                      {language === 'kn' ? 'ಬೆಳೆ & ತಳಿ' : 'Produce Listing'}
                    </span>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {offer.listing?.commodity_name || 'Arecanut'} ({offer.listing?.variety || 'Chali'})
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-500 block">
                      {language === 'kn' ? 'ಖರೀದಿದಾರರ ದರ' : 'Offered Price'}
                    </span>
                    <span className="text-sm font-black text-krishi-700 dark:text-krishi-300">
                      ₹{offer.offered_price} <span className="text-xs font-normal text-stone-500">/{offer.listing?.unit || 'kg'}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-500 block">
                      {language === 'kn' ? 'ಬೇಡಿಕೆಯ ಪ್ರಮಾಣ' : 'Quantity Needed'}
                    </span>
                    <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                      {offer.quantity} {offer.listing?.unit || 'kg'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-500 block">
                      {language === 'kn' ? 'ಒಟ್ಟು ಮೊತ್ತ' : 'Total Value'}
                    </span>
                    <span className="text-sm font-black text-stone-900 dark:text-stone-100">
                      ₹{(offer.offered_price * offer.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Buyer's Note */}
                {offer.note && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                    "{offer.note}"
                  </p>
                )}

                {/* Actions & Contact Reveal */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
                  {isAccepted ? (
                    <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-emerald-100/60 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                          {language === 'kn' ? 'ಖರೀದಿದಾರರ ನೇರ ಸಂಪರ್ಕ ವಿವರ:' : 'Buyer Direct Phone & WhatsApp:'}
                        </span>
                        <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                          {offer.buyer_phone}
                        </span>
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
                          href={`https://wa.me/${cleanPhone}?text=Namaskara,%20I%20have%20accepted%20your%20offer%20on%20KrishiSetu%20for%20${offer.listing?.commodity_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{t('common.whatsapp')}</span>
                        </a>
                      </div>
                    </div>
                  ) : isPending ? (
                    <div className="w-full flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Lock className="w-3.5 h-3.5 text-stone-400" />
                        <span>
                          {language === 'kn' ? 'ಒಪ್ಪಿಕೊಂಡ ನಂತರ ಫೋನ್ ಸಂಖ್ಯೆ ಲಭ್ಯ' : 'Contact hidden until accepted'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(offer.id, 'declined')}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                        >
                          {t('farmer.declineOffer')}
                        </button>

                        <button
                          onClick={() => {
                            setCounterModalOffer(offer);
                            setCounterPrice(offer.offered_price + 10);
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-turmeric-800 bg-turmeric-100 hover:bg-turmeric-200"
                        >
                          {t('farmer.counterOffer')}
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(offer.id, 'accepted')}
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t('farmer.acceptOffer')}</span>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Counter Modal */}
      {counterModalOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-sm w-full border shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {t('farmer.counterOffer')}
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'kn'
                ? `${counterModalOffer.buyer_name} ಅವರಿಗೆ ನಿಮ್ಮ ಹೊಸ ದರವನ್ನು ಪ್ರಸ್ತಾಪಿಸಿ.`
                : `Propose your counter price to ${counterModalOffer.buyer_name}.`}
            </p>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {language === 'kn' ? 'ಹೊಸ ದರ (₹)' : 'Counter Price (₹)'}
              </label>
              <input
                type="number"
                min="1"
                value={counterPrice}
                onChange={e => setCounterPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xl font-bold px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCounterModalOffer(null)}
                className="px-3 py-1.5 text-xs text-stone-600"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleUpdateStatus(counterModalOffer.id, 'countered', counterPrice);
                  setCounterModalOffer(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-krishi-600 rounded-xl"
              >
                {t('common.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
