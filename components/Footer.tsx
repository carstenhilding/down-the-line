"use client";

import React from 'react';
import { useLanguage } from './LanguageContext'; // <-- Importer useLanguage

// Importer sociale medie ikoner
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'; 

export default function Footer() {
  const { t } = useLanguage(); // <-- NU VIRKER DENNE LINJE KORREKT
  const currentYear = new Date().getFullYear();

  // Sikkerheds-check, da `t` er afgørende for rendering.
  // Dette kan hjælpe under indlæsning, hvis konteksten ikke er fuldt hydreret endnu.
  if (!t) {
    return (
      <footer className="bg-black text-white py-8 text-sm text-center">
        <p className="text-xs">&copy; {currentYear} Down The Line. Loading...</p>
      </footer>
    );
  }

  return (
    <footer className="bg-black text-white py-8 text-sm"> {/* py-8 for større footer */}
      <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

        {/* Tekst og Copyright */}
        <div className="flex items-center space-x-4">
          <span className="font-bold text-lg uppercase">DOWN THE LINE</span>
          {/* text-xs for mindre copyright tekst */}
          <p className="text-xs">&copy; {currentYear} Down The Line. {t.allRightsReserved}</p> 
        </div>

        {/* Fodnote Links */}
        <nav>
          <ul className="flex justify-center space-x-6">
            {/* text-xs for mindre link tekst. VIGTIGT: Brug Next.js Link komponent her også, hvis de er interne links */}
            <li><a href="#" className="text-xs hover:text-orange-500">{t.privacyPolicy}</a></li> 
            <li><a href="#" className="text-xs hover:text-orange-500">{t.termsOfService}</a></li> 
          </ul>
        </nav>

        {/* Sociale Medier Ikone */}
        <div className="flex space-x-4">
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