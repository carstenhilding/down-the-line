// i18n/getSecurePageTranslations.ts

import { secureI18n } from './secure';
import { SecureTranslations } from './secureTranslations';

export async function fetchSecureTranslations(lang: string): Promise<SecureTranslations> {
  const dict = (secureI18n as any)[lang] || (secureI18n as any)['da'];

  // Her samler vi pakken, der sendes til frontend
  return {
    header: dict.header, 
    dashboard: dict.dashboard,
    sidebar: dict.sidebar,
    trainer_page: dict.trainer_page,
    trainer: dict.trainer,
    library: dict.library, 
    
    // RETTELSE: Nu sender vi kategorierne med!
    categories: dict.categories, 
    
  } as SecureTranslations;
}