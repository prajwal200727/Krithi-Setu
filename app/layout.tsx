import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AppProvider } from '@/lib/context/AppContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'KrishiSetu | Direct Ag-Market Access for Marginal Farmers',
  description:
    'Direct market access for small and marginal farmers in Dakshina Kannada & Udupi. Transparent fair prices benchmarked against Agmarknet APMC mandi prices.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#2E7D32',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kn">
      <body className="min-h-screen flex flex-col bg-[#FAFAF5] text-stone-900 antialiased selection:bg-krishi-200">
        <AppProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-8">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
