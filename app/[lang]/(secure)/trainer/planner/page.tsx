// app/[lang]/(secure)/trainer/planner/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { fetchSecureTranslations } from '@/i18n/getSecurePageTranslations';
import { fetchUserAccessLevel, fetchSessionPlannerData, UserRole } from '@/lib/server/data';
import validateLang from '@/lib/lang';
import SessionPlannerClient from './SessionPlannerClient';

export default async function SessionPlannerPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params;
  const locale = validateLang(lang);

  // 1. Adgangskontrol
  const user = await fetchUserAccessLevel();
  if (user.role === UserRole.Unauthenticated) {
    return notFound();
  }

  // 2. Hent Data (Simuleret fra server/data.ts)
  const plannerData = await fetchSessionPlannerData(user.id, user.subscriptionLevel, user.role);

  // 3. Hent Oversættelser
  const dict = await fetchSecureTranslations(locale);

  return (
    <SessionPlannerClient 
        dict={dict}
        plannerData={plannerData}
        accessLevel={user.subscriptionLevel}
        userRole={user.role}
        lang={locale}
    />
  );
}