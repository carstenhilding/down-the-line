"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTranslations } from '../i18n'; // Korrekt sti herfra til i18n.ts

type Language = 'da' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: ReturnType<typeof getTranslations>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLang);
  const [translations, setTranslations] = useState<ReturnType<typeof getTranslations>>(getTranslations(initialLang));

  useEffect(() => {
    setTranslations(getTranslations(language));
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
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