// app/[lang]/(secure)/trainer/page.tsx - Serverkomponent for /trainer (Trainer Hub)

import { notFound } from 'next/navigation';
// KORREKTION: Importerer den korrekte funktion
import { fetchSecureTranslations } from '@/i18n/getSecurePageTranslations';
// Importerer Client Component for Trainer Hub
import TrainerClient from './TrainerClient';
import { Language } from '@/components/LanguageContext';
import validateLang from '@/lib/lang';
// Importerer datalaget
import { fetchUserAccessLevel, UserRole, SubscriptionLevel } from '@/lib/server/data';

interface TrainerPageServerProps {
 params: Promise<{ lang: string }>;
}

export default async function TrainerPage({ params }: TrainerPageServerProps) {

  // KORREKTION: Tilgår params ved at await'e dem
  const { lang } = await params;
  const locale = validateLang(lang);
  // 1. ADGANGSKONTROL
  const user = await fetchUserAccessLevel();

  if (user.role === UserRole.Unauthenticated) {
    return notFound();
  }

  // Sikkerhedscheck: Tillad kun roller, der skal se Trainer Hub
  const isAuthorized = [
      UserRole.Coach, UserRole.Admin, UserRole.HeadOfCoaching, UserRole.HeadOfTalent,
      UserRole.TransitionCoach, UserRole.DefenseCoach, UserRole.AttackCoach, UserRole.DeadBallCoach,
      UserRole.IndividualCoach, UserRole.Physio, // Physio kan se træningsplaner
      UserRole.Developer, UserRole.Tester
  ].includes(user.role);

  if (!isAuthorized) {
    return notFound(); // Bloker adgang for f.eks. Player, Parent, Scout
  }

  // 2. DATA-FETCHING
  const dict = await fetchSecureTranslations(locale);

  // Simuler data specifikt for Trainer Hub (f.eks. ugens fokus, kommende pas)
  // Dette skal senere erstattes med ægte data-kald
  const trainerHubData = {
      weeksFocus: "Ugens Fokus: Defensiv Organisation (Mock)",
      upcomingSessions: [
          { id: 1, title: "Mandagstræning - Pres", time: "17:00" },
          { id: 2, title: "Onsdagstræning - Omstillinger", time: "16:30" },
      ]
  };

  // 3. RENDERING
  return (
    <div className="flex flex-col h-full">
      <TrainerClient
        dict={dict} // Sender hele dict ned, Client vælger 'trainer_page'
        trainerHubData={trainerHubData}
        accessLevel={user.subscriptionLevel}
        userRole={user.role}
      />
    </div>
  );
}