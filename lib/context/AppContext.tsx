'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enMessages from '@/messages/en.json';
import knMessages from '@/messages/kn.json';
import { UserProfile } from '../data/store';

export type Language = 'en' | 'kn';
export type UserRole = 'farmer' | 'buyer';

export const DEMO_FARMER: UserProfile = {
  id: 'f1000000-0000-0000-0000-000000000001',
  role: 'farmer',
  full_name: 'Ramesh Gowda',
  phone: '+91 90000 00001',
  district: 'Dakshina Kannada',
  taluk: 'Puttur',
  village: 'Paduvannoor',
  language: 'kn',
  avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256',
  bio: 'Marginal arecanut and spice farmer with 2.5 acres in Puttur.',
};

export const DEMO_BUYER: UserProfile = {
  id: 'b2000000-0000-0000-0000-000000000001',
  role: 'buyer',
  full_name: 'Praveen Pai',
  phone: '+91 90000 00002',
  district: 'Dakshina Kannada',
  taluk: 'Mangaluru',
  village: 'Bunder, Mangaluru',
  language: 'en',
  business_name: 'Pai Agro Traders & Commission Agents',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
  bio: 'Commodity aggregator supplying to retail networks across Karnataka.',
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  role: UserRole;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('kn'); // Kannada by default for coastal farmers
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_FARMER);

  useEffect(() => {
    // Check saved language
    const savedLang = localStorage.getItem('krishisetu_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'kn')) {
      setLanguageState(savedLang);
    }

    // Check saved user
    const savedUser = localStorage.getItem('krishisetu_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        setCurrentUser(DEMO_FARMER);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('krishisetu_lang', lang);
  };

  const loginAs = (role: UserRole) => {
    const user = role === 'farmer' ? DEMO_FARMER : DEMO_BUYER;
    setCurrentUser(user);
    // If switching to farmer, default to Kannada; if buyer, English
    setLanguage(role === 'farmer' ? 'kn' : 'en');
    localStorage.setItem('krishisetu_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('krishisetu_user');
  };

  const role: UserRole = currentUser?.role || 'farmer';

  // Nested translation resolver
  const t = (keyPath: string, params?: Record<string, string | number>): string => {
    const messages = language === 'kn' ? knMessages : enMessages;
    const parts = keyPath.split('.');
    let current: any = messages;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to english if missing in Kannada
        let fallback: any = enMessages;
        for (const fPart of parts) {
          if (fallback && typeof fallback === 'object' && fPart in fallback) {
            fallback = fallback[fPart];
          } else {
            return keyPath;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') return keyPath;

    let result = current;
    if (params) {
      for (const [paramKey, paramVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      }
    }

    return result;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        setCurrentUser,
        role,
        t,
        loginAs,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
