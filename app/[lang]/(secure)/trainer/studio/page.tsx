// app/[lang]/(secure)/trainer/studio/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { fetchSecureTranslations } from '@/i18n/getSecurePageTranslations';
import { fetchUserAccessLevel, UserRole } from '@/lib/server/data';
import validateLang from '@/lib/lang';
import DTLStudioClient from './DTLStudioClient';

export default async function DTLStudioPage({ 
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

  // 2. Hent oversættelser
  const dict = await fetchSecureTranslations(locale);

  return (
    <DTLStudioClient 
       dict={dict}
       lang={locale}
       accessLevel={user.subscriptionLevel}
    />
  );
}