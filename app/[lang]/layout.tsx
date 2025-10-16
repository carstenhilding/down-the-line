"use client"; // Skal bruge "use client" for at bruge usePathname

import { Inter } from 'next/font/google';
import '../globals.css';
import Header from '../../components/Header';
import { LanguageProvider } from '../../components/LanguageContext';
import Footer from '../../components/Footer';
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
  params: Promise<{ lang: 'da' | 'en' }>;
}) {
  const params = React.use(paramsPromise);
  const { lang } = params;
  const pathname = usePathname(); // Hent den aktuelle sti
  
  // Bestem om Header/Footer skal vises
  // Hvis stien inkluderer '/dashboard', antager vi, at det er en backend/sikker side.
  const isSecureRoute = pathname.includes('/dashboard');

  // Vi skal flytte React.use(paramsPromise) ud af komponenten for at undgå at bruge hooks i use
  // MEN: I Next.js 13/14 skal root layout IKKE være "use client" hvis det skal bruge use()
  // Da du har use() og bruger en client-side komponent (usePathname), skal hele filen være "use client".

  return (
    <html lang={lang} className={`${inter.variable}`}> 
      <body className={inter.className}>
        <LanguageProvider initialLang={lang}>
          
          {/* VIS KUN HEADER HVIS DET IKKE ER EN SIKKER RUTE */}
          {!isSecureRoute && <Header />}
          
          <main className={`min-h-screen ${!isSecureRoute ? 'pt-[76px]' : ''} overflow-x-hidden`}>
            {children}
          </main>
          
          {/* VIS KUN FOOTER HVIS DET IKKE ER EN SIKKER RUTE */}
          {!isSecureRoute && <Footer />}
          
        </LanguageProvider>
      </body>
    </html>
  );
}
