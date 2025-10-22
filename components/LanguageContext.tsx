"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// ÆNDRING HER: Importerer den nye dedikerede funktion
import { getMainTranslations, getTranslations } from '../i18n';

type Language = 'da' | 'en';

// VIGTIGT: t-typen forbliver den samme, for at undgå at bryde de nuværende MAIN-sider.
// Men i realiteten indeholder den nu kun Main-oversættelser.
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: ReturnType<typeof getTranslations>; // BEVARER TYPEN for bagudkompatibilitet
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
  // ÆNDRING HER: Bruger nu getMainTranslations, som kun henter main/globale oversættelser
  const [translations, setTranslations] = useState<ReturnType<typeof getTranslations>>(getMainTranslations(initialLang) as ReturnType<typeof getTranslations>);

  useEffect(() => {
    // ÆNDRING HER: Skifter til at bruge getMainTranslations ved sprogskift
    setTranslations(getMainTranslations(language) as ReturnType<typeof getTranslations>);
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