// app/[lang]/(secure)/dashboard/page.tsx - Serverkomponent

import { getSecurePageTranslations } from '../../../../i18n/getSecurePageTranslations';
import DashboardClient from './DashboardClient';

// Definerer mulige niveauer for at undgå fejl
type SubscriptionLevel = 'Starter' | 'Advance' | 'Expert' | 'Performance' | 'Elite' | 'Enterprise';
type UserRole = 'coach' | 'admin' | 'player'; // Tilføj flere roller efter behov

// Data sendt som props til klienten
interface DashboardProps {
    dashboardTranslations: { [key: string]: string };
    lang: 'da' | 'en';

    // NYT: Data til at styre adgang i UI'et
    userData: {
        role: UserRole;
        subscriptionLevel: SubscriptionLevel;
    };
}

interface DashboardPageServerProps {
    params: Promise<{ lang: 'da' | 'en' }>;
}

export default async function DashboardPageServer({ params }: DashboardPageServerProps) {
    const awaitedParams = await params;
    const { lang: finalLang } = awaitedParams;

    let dashboardTranslations;
    try {
        dashboardTranslations = getSecurePageTranslations(finalLang, 'dashboard');
    } catch (error) {
        console.error("Failed to load dashboard translations:", error);
        dashboardTranslations = {};
    }

    // --- NY LOGIK: SIMULER BRUGER DATA HER ---
    // Denne data vil senere komme fra din Firebase Authentication og Firestore
    const mockedUserData = {
        role: 'coach' as UserRole, // Hårdt kodet for nu - 'coach', 'admin', 'player' etc.
        // SKIFT DENNE VÆRDI FOR AT TESTE: 'Starter' viser CTA, 'Elite' viser data
        subscriptionLevel: 'Elite' as SubscriptionLevel,
    };
    // ------------------------------------------

    const finalTranslations = dashboardTranslations || {};

    // Sender nu både oversættelser, sprog OG brugerdata til klienten
    return (
        <DashboardClient
            dashboardTranslations={finalTranslations}
            lang={finalLang}
            userData={mockedUserData}
        />
    );
}