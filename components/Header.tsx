"use client";

import React from 'react';
import { useLanguage } from './LanguageContext'; // <-- Importer useLanguage

const Header = () => {
  const { lang: currentLang, t, setLang } = useLanguage(); // Brug useLanguage hook

  // Funktion til at skifte sprog via konteksten
  const toggleLanguage = (newLang: 'en' | 'da') => {
    setLang(newLang);
  };

  return (
    <header className="bg-white text-black shadow-sm">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">

        {/* Venstre side: Kun Logo */}
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl tracking-wide">
            DOWN THE LINE
          </h1>
          <p className="text-[9px] tracking-widest self-center -mt-1">
            FOOTBALL COACHING PLATFORM
          </p>
          <div className="h-0.5 w-full bg-orange-500 mt-1"></div>
        </div>

        {/* Højre side: Navigation og Knapper samlet */}
        <div className="hidden md:flex items-center gap-6">
          {/* Navigation Links */}
          <nav className="flex gap-6 items-center">
            <a href="#" className="hover:text-orange-500 transition-colors">{t.headerHome}</a>
            <a href="#" className="hover:text-orange-500 transition-colors">{t.headerFeatures}</a>
            <a href="#" className="hover:text-orange-500 transition-colors">{t.headerPricing}</a>
            <a href="#" className="hover:text-orange-500 transition-colors">{t.headerAbout}</a>
          </nav>

          {/* Knapper */}
          <div className="flex items-center gap-4">
            <a href="#" className="font-semibold border border-black rounded-md px-4 py-2 hover:bg-black hover:text-white transition-all">
              {t.headerLogin}
            </a>
            <a href="#" className="font-semibold bg-orange-500 text-white border border-transparent rounded-md px-4 py-2 hover:bg-orange-600 transition-all">
              {t.headerJoin}
            </a>
          </div>

          {/* Sprogvælger */}
          <div className="ml-4 flex items-center gap-2">
            <button 
              onClick={() => toggleLanguage('da')} 
              className={`font-semibold ${currentLang === 'da' ? 'text-orange-500' : 'text-gray-700'} hover:text-orange-500 transition-colors`}
            >
              DA
            </button>
            <span className="text-gray-400">|</span>
            <button 
              onClick={() => toggleLanguage('en')} 
              className={`font-semibold ${currentLang === 'en' ? 'text-orange-500' : 'text-gray-700'} hover:text-orange-500 transition-colors`}
            >
              EN
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;