'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, DEMO_FARMER, DEMO_BUYER } from '@/lib/context/AppContext';
import {
  Sprout,
  Store,
  Phone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const { language, t, loginAs, setCurrentUser } = useApp();

  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      loginAs(role);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
      setIsVerifying(false);
      router.push(role === 'farmer' ? '/farmer/listings' : '/browse');
    }, 600);
  };

  const handleQuickDemoLogin = (selectedRole: 'farmer' | 'buyer') => {
    loginAs(selectedRole);
    router.push(selectedRole === 'farmer' ? '/farmer/listings' : '/browse');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-krishi-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-krishi-600/30">
          <Sprout className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
          {t('auth.loginTitle')}
        </h1>
        <p className="text-xs text-stone-500">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      {/* Role Picker */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-100 dark:bg-stone-800 rounded-2xl">
        <button
          type="button"
          onClick={() => setRole('farmer')}
          className={`py-3 px-3 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all ${
            role === 'farmer'
              ? 'bg-white dark:bg-stone-700 text-krishi-700 dark:text-krishi-300 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="text-xl">🌾</span>
          <span>{t('auth.iAmFarmer')}</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('buyer')}
          className={`py-3 px-3 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all ${
            role === 'buyer'
              ? 'bg-white dark:bg-stone-700 text-krishi-700 dark:text-krishi-300 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="text-xl">🏢</span>
          <span>{language === 'kn' ? 'ಖರೀದಿದಾರ' : 'Buyer'}</span>
        </button>
      </div>

      {/* Phone OTP Form */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-md">
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {t('auth.enterPhone')}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-semibold text-stone-400">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="90000 00001"
                  className="w-full pl-12 pr-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-semibold focus:ring-2 focus:ring-krishi-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-krishi-600 hover:bg-krishi-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
            >
              {t('auth.sendOtp')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {t('auth.enterOtp')}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-widest text-xl font-bold py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-krishi-500"
              />
              <span className="text-[11px] text-stone-400 text-center block mt-1">
                {language === 'kn' ? 'ಡೆಮೋಗಾಗಿ 123456 ನಮೂದಿಸಿ' : 'Enter 123456 for demo verification'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-2xl bg-krishi-600 hover:bg-krishi-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
            >
              {isVerifying ? t('common.loading') : t('auth.verifyOtp')}
            </button>
          </form>
        )}

        {/* 1-Click Demo Accounts */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 space-y-2">
          <p className="text-xs font-bold text-stone-600 dark:text-stone-400 text-center mb-2">
            {t('auth.demoAccountsTitle')}
          </p>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('farmer')}
            className="w-full py-2.5 px-3 rounded-xl bg-krishi-50 dark:bg-krishi-950/40 border border-krishi-200 dark:border-krishi-900 text-krishi-800 dark:text-krishi-300 font-bold text-xs flex items-center justify-between hover:bg-krishi-100 transition-colors"
          >
            <span>👨‍🌾 {t('auth.farmerDemo')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('buyer')}
            className="w-full py-2.5 px-3 rounded-xl bg-turmeric-50 dark:bg-turmeric-950/40 border border-turmeric-200 dark:border-turmeric-900 text-turmeric-900 dark:text-turmeric-300 font-bold text-xs flex items-center justify-between hover:bg-turmeric-100 transition-colors"
          >
            <span>🏢 {t('auth.buyerDemo')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
