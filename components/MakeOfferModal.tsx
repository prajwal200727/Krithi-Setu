'use client';

import React, { useState } from 'react';
import { Listing } from '@/lib/data/store';
import { useApp } from '@/lib/context/AppContext';
import { X, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MakeOfferModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MakeOfferModal({
  listing,
  isOpen,
  onClose,
  onSuccess,
}: MakeOfferModalProps) {
  const { language, t, currentUser } = useApp();
  const [offeredPrice, setOfferedPrice] = useState<number>(listing.asking_price);
  const [quantity, setQuantity] = useState<number>(listing.quantity);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const totalValue = offeredPrice * quantity;
  const commodityName = language === 'kn' ? listing.commodity_name_kn : listing.commodity_name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offeredPrice <= 0 || quantity <= 0) {
      setErrorMessage(language === 'kn' ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ದರ ಮತ್ತು ಪ್ರಮಾಣವನ್ನು ನಮೂದಿಸಿ' : 'Please enter valid price and quantity');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        listing_id: listing.id,
        buyer_id: currentUser?.id || 'b2000000-0000-0000-0000-000000000001',
        buyer_name: currentUser?.full_name || 'Demo Buyer',
        buyer_phone: currentUser?.phone || '+91 90000 00002',
        buyer_business: currentUser?.business_name || 'Agro Buyer',
        offered_price: offeredPrice,
        quantity: quantity,
        note: note.trim() || 'Ready to lift from farm directly.',
      };

      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to send offer');
      }

      setIsSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {language === 'kn' ? 'ಆಫರ್ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!' : 'Offer Sent Successfully!'}
            </h3>
            <p className="text-sm text-stone-500 max-w-sm mb-4">
              {t('buyer.offerSent')}
            </p>
            <div className="text-xs text-krishi-600 font-medium">
              {language === 'kn' ? 'ರೈತರು ಒಪ್ಪಿಕೊಂಡ ನಂತರ ಅವರ ಫೋನ್ ಸಂಖ್ಯೆ ಲಭ್ಯವಾಗುತ್ತದೆ.' : 'Farmer contact details will be revealed once accepted.'}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-krishi-600 dark:text-krishi-400">
                {t('buyer.makeOffer')}
              </span>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                {commodityName} ({listing.variety})
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {listing.farmer_name} • {listing.taluk}, {listing.district}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {language === 'kn' ? `ನಿಮ್ಮ ದರ (₹/${listing.unit})` : `Your Price (₹/${listing.unit})`}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      value={offeredPrice}
                      onChange={e => setOfferedPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-krishi-500 font-bold"
                    />
                  </div>
                  <span className="text-[11px] text-stone-400 mt-0.5 block">
                    {language === 'kn' ? `ರೈತರ ಕೇಳಿಕೆ: ₹${listing.asking_price}` : `Farmer asking: ₹${listing.asking_price}`}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {language === 'kn' ? `ಪ್ರಮಾಣ (${listing.unit})` : `Quantity (${listing.unit})`}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={listing.quantity}
                    value={quantity}
                    onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-krishi-500 font-bold"
                  />
                  <span className="text-[11px] text-stone-400 mt-0.5 block">
                    {language === 'kn' ? `ಗರಿಷ್ಠ ಲಭ್ಯ: ${listing.quantity}` : `Max available: ${listing.quantity}`}
                  </span>
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <span className="text-xs text-stone-600 dark:text-stone-400">
                  {language === 'kn' ? 'ಒಟ್ಟು ಅಂದಾಜು ಮೊತ್ತ' : 'Total Deal Value'}
                </span>
                <span className="text-base font-extrabold text-krishi-700 dark:text-krishi-300">
                  ₹{totalValue.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {language === 'kn' ? 'ರೈತರಿಗೆ ಸಂದೇಶ (ಐಚ್ಛಿಕ)' : 'Message / Logistics Note'}
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder={
                    language === 'kn'
                      ? 'ಉದಾ: ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಬಂದು ತೂಕ ಮಾಡಿ ತೆಗೆದುಕೊಂಡು ಹೋಗುತ್ತೇವೆ.'
                      : 'e.g. Can pick up tomorrow with direct truck, prompt payment on weighing.'
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-krishi-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-krishi-600 shrink-0" />
                <span>
                  {language === 'kn'
                    ? '0% ಮಧ್ಯವರ್ತಿ ಕಮಿಷನ್. ನೇರ ರೈತ ಮತ್ತು ಖರೀದಿದಾರರ ಒಪ್ಪಂದ.'
                    : 'Zero commission. Direct farmer-buyer connect.'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-krishi-600 hover:bg-krishi-700 shadow-md shadow-krishi-600/20 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? t('common.loading') : t('buyer.sendOffer')}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
