// app/[lang]/(secure)/dashboard/page.tsx - Serverkomponent

import { getSecurePageTranslations } from '../../../../i18n/getSecurePageTranslations';
import DashboardClient from './DashboardClient'; 

interface DashboardPageServerProps {
    // ÆNDRING HER: params er et Promise
    params: Promise<{ lang: 'da' | 'en' }>; 
}

export default async function DashboardPageServer({ params }: DashboardPageServerProps) {
    
    // NY LØSNING: Await params før dekonstruktion
    const awaitedParams = await params;
    const { lang } = awaitedParams; // Bruger nu den afventede værdi
    
    let dashboardTranslations;
    try {
        // Hent de nødvendige oversættelser 
        // Vi beholder 'as any' for at sikre, at der ikke opstår type-konflikter, indtil vi har de strammeste typer.
        dashboardTranslations = getSecurePageTranslations(lang, 'dashboard') as any;
    } catch (error) {
        console.error("Failed to load dashboard translations:", error);
        // Sikkerheds-fallback til et tomt objekt
        dashboardTranslations = {}; 
    }

    const finalTranslations = dashboardTranslations || {};

    return (
        <DashboardClient 
            dashboardTranslations={finalTranslations} 
            lang={lang}
        />
    );
}