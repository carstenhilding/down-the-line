"use client"; // VIGTIGT

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getTranslations } from '../i18n'; // <-- VIGTIGT: Importer getTranslations her

type Language = 'da' | 'en';
type Translations = ReturnType<typeof getTranslations>; // Henter typen for oversættelsesobjektet

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations; // <-- TILFØJET: Nu indeholder konteksten også oversættelserne
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang: Language }) {
  const [language, setLanguage] = useState<Language>(initialLang);
  const [t, setT] = useState<Translations>(getTranslations(initialLang)); // <-- Initialiser t her

  // Opdater oversættelser, når sproget ændres
  useEffect(() => {
    setT(getTranslations(language));
  }, [language]); // Kør kun, når 'language' ændres

  // Send både language, setLanguage og t ned i konteksten
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}