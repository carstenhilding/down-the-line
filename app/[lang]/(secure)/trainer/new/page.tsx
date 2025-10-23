// app/[lang]/(secure)/trainer/new/page.tsx - Serverkomponent

import { getSecurePageTranslations } from '../../../../../i18n/getSecurePageTranslations';
import NewTrainerClient from './NewTrainerClient'; 

interface NewTrainerPageServerProps {
    // Bemærk: Type er sat til Promise for at undgå Next.js fejl
    params: Promise<{ lang: 'da' | 'en' }>;
}

export default async function NewTrainerPageServer({ params }: NewTrainerPageServerProps) {
    
    // Sikrer korrekt asynkron adgang til params
    const awaitedParams = await params;
    const { lang: finalLang } = awaitedParams;

    let trainerTranslations;
    try {
        // Henter kun 'trainer' sektionen, som er nødvendig for at siden fungerer
        trainerTranslations = getSecurePageTranslations(finalLang, 'trainer');
    } catch (error) {
        console.error("Failed to load trainer translations (expected if i18n is not fully initialized):", error);
        // Fallback til tomt objekt
        trainerTranslations = {};
    }
    
    const finalTranslations = trainerTranslations || {};

    // Returnerer den minimale klientkomponent med de hentede oversættelser
    return (
        <NewTrainerClient 
            trainerTranslations={finalTranslations}
            lang={finalLang}
        />
    );
}