// i18n/index.ts - Samler alle oversættelser

import { mainI18n, mainI18n as mainI18nType } from './main';
import { secureI18n, secureI18n as secureI18nType } from './secure';

// Definér typen for det samlede oversættelsesobjekt
type CombinedTranslations = {
    [lang in 'en' | 'da']: typeof mainI18nType['en'] & typeof secureI18nType['en'];
};

// Kombiner objekterne for hvert sprog
export const i18n: CombinedTranslations = {
    en: { ...mainI18n.en, ...secureI18n.en },
    da: { ...mainI18n.da, ...secureI18n.da },
};

// Vi definerer den standardfunktion, der returnerer ALLE oversættelser for et givet sprog (Bruges af LanguageContext)
export function getTranslations(lang: 'en' | 'da'): CombinedTranslations['en'] {
    return i18n[lang];
}

// ----------------------------------------------------
// NYE EKSPORTER: Dedikerede funktioner til adskillelse
// ----------------------------------------------------

// 1. Funktion til kun at hente Main-oversættelser (Bruges af Header/Footer)
export function getMainTranslations(lang: 'en' | 'da'): typeof mainI18n['en'] {
    return mainI18n[lang];
}

// 2. Funktion til kun at hente Secure-oversættelser
export function getSecureTranslations(lang: 'en' | 'da'): typeof secureI18n['en'] {
    return secureI18n[lang];
}

// Eksporter også de separate objekter (valgfrit, men nyttigt til dybde-import)
export { mainI18n, secureI18n };