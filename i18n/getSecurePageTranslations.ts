// i18n/getSecurePageTranslations.ts

import { secureI18n } from './secure';
import { SecureTranslations } from './secureTranslations';

// KORREKT EKSPORTNAVN: fetchSecureTranslations
export async function fetchSecureTranslations(lang: string): Promise<SecureTranslations> {
  const dict = (secureI18n as any)[lang] || (secureI18n as any)['da'];

  // Denne funktion udtrækker kun de nøgler, der er defineret i SecureTranslations typen.
  return {
    dashboard: dict.dashboard,
    // TILFØJET: Sikrer, at 'header' nøglen inkluderes i dict til layout.tsx
    header: dict.header, 
    sidebar: dict.sidebar,
    trainer_page: dict.trainer_page,
    // SIKRER 'trainer' nøglen er inkluderet
    trainer: dict.trainer,
    library: dict.library, // <-- NY LINJE 
    
    // Tilføj fremtidige moduler her:
    // calendar: dict.calendar,
    // scouting: dict.scouting,
  } as SecureTranslations;
}