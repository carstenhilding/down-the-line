"use client"; // Skal være en Client Component

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getTranslations } from '../i18n'; // Stien skal være korrekt herfra

// Definer typen for sprog-konteksten
interface LanguageContextType {
  lang: 'en' | 'da';
  t: ReturnType<typeof getTranslations>; // Dynamisk type for oversættelsesobjektet
  setLang: (lang: 'en' | 'da') => void;
}

// Opret konteksten med standardværdier
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Opret en Provider-komponent, som vil omfatte din app
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'en' | 'da'>('da'); // Standardsprog er dansk
  const t = getTranslations(lang);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook til nemt at bruge konteksten i andre komponenter
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}