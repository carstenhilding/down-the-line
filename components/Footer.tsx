"use client";

import React from 'react';
import Link from 'next/link'; // <--- VIGTIGT: Importér Next.js Link
import { useLanguage } from './LanguageContext';

// Importer sociale medie ikoner
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'; 

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  if (!t) {
    return (
      <footer className="bg-black text-white py-8 text-sm text-center">
        <p className="text-xs">&copy; {currentYear} Down The Line. Loading...</p>
      </footer>
    );
  }

  return (
    <footer className="bg-black text-white py-8 text-sm">
      <div className="container max-w-6xl mx-auto px-4 
                      flex flex-col md:flex-row justify-between items-center 
                      space-y-6 md:space-y-0 text-center md:text-left"> {/* Øget space-y for mobil, og justeret tekstjustering */}

        {/* Logo, Tekst og Copyright - justeret til at være venstrejusteret på mobil */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4"> {/* Stack logo/copyright på mobil */}
          <span className="font-bold text-lg uppercase">DOWN THE LINE</span>
          <p className="text-xs">&copy; {currentYear} Down The Line. {t.allRightsReserved}</p> 
        </div>

        {/* Fodnote Links */}
        <nav className="w-full md:w-auto"> {/* Sikre nav fylder bredden på mobil for centrering */}
          <ul className="flex justify-center md:justify-start space-x-6"> {/* Centrer links på mobil, venstrejuster på desktop */}
            <li><Link href="/privacy" className="text-xs hover:text-orange-500">{t.privacyPolicy}</Link></li> {/* Brug Link komponent */}
            <li><Link href="/terms" className="text-xs hover:text-orange-500">{t.termsOfService}</Link></li> {/* Brug Link komponent */}
          </ul>
        </nav>

        {/* Sociale Medier Ikone */}
        <div className="flex justify-center md:justify-start space-x-4 w-full md:w-auto"> {/* Centrer ikoner på mobil, venstrejuster på desktop */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500">
            <FaFacebookF size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500">
            <FaInstagram size={20} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500">
            <FaYoutube size={20} />
          </a>
        </div>

      </div>
    </footer>
  );
}