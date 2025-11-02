// app/[lang]/(secure)/dashboard/page.tsx (RETTET: fjerner h-full div)

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

  const { lang } = await params;
  const locale = validateLang(lang);

  // 1. ADGANGSKONTROL PUNKT
  const user = await fetchUserAccessLevel();

  if (user.role === UserRole.Unauthenticated) {
    return notFound();
  }

  const dict = await fetchSecureTranslations(locale);

  // Simuleret dashboard data
  const dashboardData = {
      activityFeed: ["Spiller X har meldt afbud.", "Ny video er uploaded."],
      teamReadiness: { score: 78, status: 'grøn' },
  };

  // 3. RENDERING (RETTET: Den ydre <div> er fjernet for at stoppe dobbelt scrollbar)
  return (
      <DashboardClient
        dict={dict}
        dashboardData={dashboardData}
        accessLevel={user.subscriptionLevel}
        userRole={user.role}
      />
  );
}