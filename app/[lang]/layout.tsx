// IKKE "use client" her
import { Inter } from 'next/font/google';
import '../globals.css';
import Header from '../../components/Header';
import { LanguageProvider } from '../../components/LanguageContext';
import Footer from '../../components/Footer';
import React from 'react';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
  params: paramsPromise
}: {
  children: React.ReactNode;
  params: Promise<{ lang: 'da' | 'en' }>;
}) {
  const params = React.use(paramsPromise);
  const { lang } = params;

  return (
    <html lang={lang} className={`${inter.variable}`}> 
      <body className={inter.className}>
        <LanguageProvider initialLang={lang}>
          <Header />
          {/* --- OPDATERING HER: 'overflow-x-hidden' er tilføjet --- */}
          <main className="min-h-screen pt-[76px] overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}