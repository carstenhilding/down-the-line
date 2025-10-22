// app/[lang]/(secure)/trainer/page.tsx - Serverkomponent for /trainer

import { getSecurePageTranslations } from '../../../../i18n/getSecurePageTranslations';
import TrainerClient from './TrainerClient'; 

interface TrainerPageServerProps {
    params: { lang: 'da' | 'en' };
}

export default async function TrainerPageServer({ params }: TrainerPageServerProps) {
    
    // NY LØSNING: Await params for at undgå Next.js fejl
    const awaitedParams = await params;
    const { lang: finalLang } = awaitedParams;

    let trainerPageTranslations;
    try {
        // Henter kun 'trainer_page' sektionen
        trainerPageTranslations = getSecurePageTranslations(finalLang, 'trainer_page');
    } catch (error) {
        console.error("Failed to load trainer page translations:", error);
        trainerPageTranslations = {}; 
    }

    const finalTranslations = trainerPageTranslations || {};

    return (
        <TrainerClient 
            trainerPageTranslations={finalTranslations} 
            lang={finalLang}
        />
    );
}