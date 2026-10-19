'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Sprout,
  Store,
  PlusCircle,
  TrendingUp,
  Inbox,
  User,
  Globe,
  RefreshCw,
  Menu,
  X,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, role, loginAs, t, currentUser } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'kn' ? 'en' : 'kn');
  };

  const navLinks = [
    { href: '/browse', label: t('nav.browse'), icon: Store },
    { href: '/prices', label: t('nav.mandiPrices'), icon: TrendingUp },
    ...(role === 'farmer'
      ? [
          { href: '/farmer/new', label: t('nav.addProduce'), icon: PlusCircle, highlight: true },
          { href: '/farmer/listings', label: t('nav.myListings'), icon: Sprout },
          { href: '/farmer/offers', label: t('nav.offers'), icon: Inbox },
        ]
      : [
          { href: '/buyer/offers', label: t('nav.offers'), icon: Inbox },
        ]),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-krishi-600 to-krishi-800 flex items-center justify-center text-white shadow-md shadow-krishi-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                  {language === 'kn' ? 'ಕೃಷಿಸೇತು' : 'KrishiSetu'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-krishi-100 dark:bg-krishi-900/50 text-krishi-800 dark:text-krishi-300">
                  MVP
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium leading-none">
                {language === 'kn' ? 'ದ.ಕ & ಉಡುಪಿ ಕೃಷಿಕರ ನೇರ ಸಂಪರ್ಕ' : 'DK & Udupi Direct Ag-Market'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
                    link.highlight
                      ? 'bg-krishi-600 hover:bg-krishi-700 text-white shadow-sm shadow-krishi-600/20'
                      : isActive
                      ? 'bg-krishi-50 dark:bg-krishi-950/50 text-krishi-700 dark:text-krishi-300'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Role Switcher & Language Toggle */}
          <div className="flex items-center gap-2">
            {/* Demo Role Switcher Button */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => loginAs('farmer')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  role === 'farmer'
                    ? 'bg-white dark:bg-stone-700 text-krishi-700 dark:text-krishi-300 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Switch to Farmer mode"
              >
                {language === 'kn' ? '🌾 ಕೃಷಿಕ' : '🌾 Farmer'}
              </button>
              <button
                type="button"
                onClick={() => loginAs('buyer')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  role === 'buyer'
                    ? 'bg-white dark:bg-stone-700 text-krishi-700 dark:text-krishi-300 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Switch to Buyer mode"
              >
                {language === 'kn' ? '🏢 ಖರೀದಿದಾರ' : '🏢 Buyer'}
              </button>
            </div>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-turmeric-50 dark:bg-turmeric-950/40 border border-turmeric-300 dark:border-turmeric-800 text-turmeric-800 dark:text-turmeric-300 hover:bg-turmeric-100 transition-colors"
              title="Toggle Kannada / English"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  link.highlight
                    ? 'bg-krishi-600 text-white'
                    : isActive
                    ? 'bg-krishi-50 text-krishi-700'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-stone-100 text-xs text-stone-500">
            <p className="font-semibold text-stone-700 mb-1">
              {language === 'kn' ? 'ಲಾಗಿನ್ ಆಗಿರುವ ಖಾತೆ:' : 'Logged in as:'}
            </p>
            <p>
              {currentUser?.full_name} ({currentUser?.phone})
            </p>
          </div>
        </div>
      )}

      {/* Bottom Sticky Bar for Mobile Users (Farmer-first low literacy UX) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <Link
          href="/browse"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
            pathname === '/browse' ? 'text-krishi-600' : 'text-stone-500'
          }`}
        >
          <Store className="w-5 h-5" />
          <span>{t('nav.browse')}</span>
        </Link>

        {role === 'farmer' ? (
          <Link
            href="/farmer/new"
            className="flex flex-col items-center -mt-4 bg-krishi-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white"
          >
            <PlusCircle className="w-6 h-6" />
          </Link>
        ) : (
          <Link
            href="/prices"
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
              pathname === '/prices' ? 'text-krishi-600' : 'text-stone-500'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>{t('nav.mandiPrices')}</span>
          </Link>
        )}

        <Link
          href={role === 'farmer' ? '/farmer/offers' : '/buyer/offers'}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
            pathname.includes('/offers') ? 'text-krishi-600' : 'text-stone-500'
          }`}
        >
          <Inbox className="w-5 h-5" />
          <span>{t('nav.offers')}</span>
        </Link>
      </div>
    </header>
  );
}
