// IKKE "use client" her
import { Inter } from 'next/font/google';
import '../globals.css';
import Header from '../../components/Header';
import { LanguageProvider } from '../../components/LanguageContext';
import Footer from '../../components/Footer';
import React from 'react'; // <--- VIGTIGT: Importér React for React.use()

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', // <-- TILFØJET HER
});
export default function RootLayout({
  children,
  params: paramsPromise // <-- Navngiv som en Promise
}: {
  children: React.ReactNode;
  params: Promise<{ lang: 'da' | 'en' }>; // <-- Type for Promise
}) {
  const params = React.use(paramsPromise); // <-- Pak params ud
  const { lang } = params; // <-- Tilgå lang fra det udpakkede objekt

  return (
    <html lang={lang} className={`${inter.variable}`}> 
      <body>
        <LanguageProvider initialLang={lang}>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}