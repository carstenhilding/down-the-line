// app/[lang]/(secure)/dashboard/page.tsx (FINAL KORREKTION V8: await params FØRST)

import { notFound } from 'next/navigation';
import { fetchSecureTranslations } from '@/i18n/getSecurePageTranslations';
import { Language } from '@/components/LanguageContext';
import validateLang from '@/lib/lang';
import DashboardClient from './DashboardClient';
import { fetchUserAccessLevel, UserRole, SubscriptionLevel } from '@/lib/server/data';

 interface DashboardPageProps {
   params: Promise<{ lang: string }>;
 }


export default async function DashboardPage({ params }: DashboardPageProps) {

  // KORREKTION: Tilgår params *allerførst* — await params before using its properties
  const { lang } = await params; // params is a Promise<{ lang: 'da'|'en' }>
  const locale = validateLang(lang);

  // 1. ADGANGSKONTROL PUNKT
  const user = await fetchUserAccessLevel();

  if (user.role === UserRole.Unauthenticated) {
    return notFound();
  }

  // Bruger 'lang' som blev læst FØR await
  const dict = await fetchSecureTranslations(locale);

  // Simuleret dashboard data
  const dashboardData = {
      activityFeed: ["Spiller X har meldt afbud.", "Ny video er uploaded."],
      teamReadiness: { score: 78, status: 'grøn' },
  };

  // 3. RENDERING
  return (
    <div className="flex flex-col h-full">
      <DashboardClient
        dict={dict}
        dashboardData={dashboardData}
        accessLevel={user.subscriptionLevel}
        userRole={user.role}
      />
    </div>
  );
}