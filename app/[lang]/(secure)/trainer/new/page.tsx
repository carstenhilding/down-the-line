// app/[lang]/(secure)/trainer/new/page.tsx (FINAL KORREKTION V5: Destrukturering)

import { notFound } from 'next/navigation';
import { fetchUserAccessLevel, fetchSessionPlannerData, UserRole, SubscriptionLevel } from '@/lib/server/data';
// KORREKT IMPORT
import { fetchSecureTranslations } from '@/i18n/getSecurePageTranslations';
import NewTrainerClient from './NewTrainerClient';
import { Language } from '@/components/LanguageContext';
import validateLang from '@/lib/lang';

interface PageProps {
 // KORREKTION: Params type defineres her som Promise for App Router
 params: Promise<{ lang: string }>;
}

// KORREKTION: Tilgår params ved at await'e dem
export default async function NewTrainerPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = validateLang(lang);
 // 1. ADGANGSKONTROL PUNKT
 const user = await fetchUserAccessLevel();

 if (user.role === UserRole.Unauthenticated) {
   return notFound();
 }

 // KORREKTION: Bruger kun roller defineret i UserRole enum
 const isPlanner = [
   UserRole.Coach, UserRole.Admin, UserRole.HeadOfCoaching, UserRole.HeadOfTalent,
   UserRole.TransitionCoach, UserRole.DefenseCoach, UserRole.AttackCoach, UserRole.DeadBallCoach, // Sikrer korrekt navn
   UserRole.IndividualCoach, UserRole.Physio,
   UserRole.Developer, UserRole.Tester
 ].includes(user.role);

 if (!isPlanner) {
   return notFound();
 }

 // 2. DATA-FETCHING
 // KORREKTION: Bruger 'lang' direkte
  const [dict, sessionData] = await Promise.all([
  fetchSecureTranslations(locale),
   fetchSessionPlannerData(user.id, user.subscriptionLevel as SubscriptionLevel, user.role),
 ]);

 // 3. RENDERING
 return (
   <NewTrainerClient
     dict={dict}
     sessionData={sessionData}
     userRole={user.role}
     accessLevel={user.subscriptionLevel}
   />
 );
}