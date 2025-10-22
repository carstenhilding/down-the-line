// i18n/getSecurePageTranslations.ts
// Bruger kun sprogkoden (lang) til at hente de nødvendige oversættelser for en side.

import { getSecureTranslations, secureI18n } from './index';

type Lang = 'en' | 'da';
type SecureDomain = keyof typeof secureI18n['en'];
// Denne type repræsenterer den komplette secure ordbog
type SecureTranslations = ReturnType<typeof getSecureTranslations>;


/**
 * Henter alle secure oversættelser for et givet sprog.
 * Dette er den grundlæggende funktion, der kan bruges i serverkomponenter.
 */
export function getAllSecureTranslations(lang: Lang): SecureTranslations {
    return getSecureTranslations(lang);
}

/**
 * Henter oversættelser for et specifikt domæne (underside/komponent) i det sikre område.
 * Bruges i serverkomponenter.
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