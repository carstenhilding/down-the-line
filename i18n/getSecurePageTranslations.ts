// i18n/getSecurePageTranslations.ts 

import { getSecureTranslations, secureI18n } from './index';

type Lang = 'en' | 'da';
type SecureDomain = keyof typeof secureI18n['en'];
type SecureTranslations = ReturnType<typeof getSecureTranslations>;

/**
 * Henter oversættelser for et specifikt domæne (underside/komponent) i det sikre område.
 * @param lang Det aktuelle sprog ('en' eller 'da').
 * @param domain Navnet på den ønskede sektion (f.eks. 'dashboard', 'trainer_page').
 * @returns Objektet, der kun indeholder de ønskede oversættelser.
 */
export function getSecurePageTranslations<T extends SecureDomain>(
    lang: Lang, 
    domain: T
): SecureTranslations[T] {
    const secureTranslations = getSecureTranslations(lang);
    return secureTranslations[domain];
}

/**
 * Henter alle secure oversættelser for et givet sprog. (Valgfri, men god praksis)
 */
export function getAllSecureTranslations(lang: Lang): SecureTranslations {
    return getSecureTranslations(lang);
}