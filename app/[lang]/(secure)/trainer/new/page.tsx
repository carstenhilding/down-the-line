// app/[lang]/(secure)/trainer/new/page.tsx - Serverkomponent (RETTET)

import { getSecurePageTranslations } from '../../../../../i18n/getSecurePageTranslations';
import NewTrainerClient from './NewTrainerClient'; 

interface NewTrainerPageServerProps {
    // Sørg for at typen er sat som Promise, som vi aftalte
    params: Promise<{ lang: 'da' | 'en' }>;
}

export default async function NewTrainerPageServer({ params }: NewTrainerPageServerProps) {
    
    // RETTET: Fjerner den fejlbehæftede linje 'const { lang } = params;'
    
    const awaitedParams = await params;
    const { lang: finalLang } = awaitedParams; // Bruger den korrekte dekonstruktion

    let trainerTranslations;
    try {
        // Bruger finalLang fra den afventede parameter
        trainerTranslations = getSecurePageTranslations(finalLang, 'trainer');
    } catch (error) {
        console.error("Failed to load new trainer translations:", error);
        trainerTranslations = {};
    }
    
    const finalTranslations = trainerTranslations || {};

    return (
        <NewTrainerClient 
            trainerTranslations={finalTranslations}
            lang={finalLang}
        />
    );
}