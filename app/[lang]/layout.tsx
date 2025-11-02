"use client"; // Skal bruge "use client" for at bruge usePathname

import { Inter } from 'next/font/google';
import '../globals.css';
import Header from '../../components/Header';
import { LanguageProvider, Language } from '../../components/LanguageContext';
import Footer from '../../components/Footer';
import validateLang from '@/lib/lang';
import React from 'react';
import { usePathname } from 'next/navigation'; // Importér usePathname

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
  params: paramsPromise
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const params = React.use(paramsPromise);
  const { lang: rawLang } = params as { lang: string };
  const lang = validateLang(rawLang);
  const pathname = usePathname(); // Hent den aktuelle sti
  
  // NYT TJEK: Skjul Header/Footer, hvis stien indeholder /dashboard ELLER /trainer
  const isSecureRoute = pathname.includes('/dashboard') || pathname.includes('/trainer');

  return (
    <html lang={lang} className={`${inter.variable}`}> 
      <body className={inter.className}>
        <LanguageProvider initialLang={lang}>
          
          {/* VIS KUN HEADER HVIS DET IKKE ER EN SIKKER RUTE */}
          {!isSecureRoute && <Header />}
          
          {/* RETTET: 
            - 'min-h-screen' og 'pt-[76px]' anvendes KUN, hvis det IKKE er en sikker rute.
            - Sikre ruter (som dashboard) styrer selv deres højde (via SecureLayoutClient.tsx).
            - Dette fjerner den dobbelte scrollbar.
          */}
          <main className={`${!isSecureRoute ? 'min-h-screen pt-[76px]' : ''} overflow-x-hidden`}>
            {children}
          </main>
          
          {/* VIS KUN FOOTER HVIS DET IKKE ER EN SIKKER RUTE */}
          {!isSecureRoute && <Footer />}
          
        </LanguageProvider>
      </body>
    </html>
  );
}