import type { Language } from '@/components/LanguageContext';

// Supported language codes
const SUPPORTED: Language[] = ['da', 'en'];

export function isValidLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (value === 'da' || value === 'en');
}

export function validateLang(raw: unknown): Language {
  if (isValidLanguage(raw)) return raw;
  if (typeof raw === 'string') {
    const lower = raw.toLowerCase();
    if (SUPPORTED.includes(lower as Language)) return lower as Language;
  }
  return 'en';
}

export default validateLang;
