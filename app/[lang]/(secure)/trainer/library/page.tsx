// app/[lang]/(secure)/trainer/library/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { fetchSecureTranslations } from '@/i18n/getSecurePageTranslations';
import { fetchUserAccessLevel, UserRole } from '@/lib/server/data';
import validateLang from '@/lib/lang';
import LibraryClient from './LibraryClient';

export default async function LibraryPage({ 
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

  // 3. Serialiser data for at undgå "Expected static flag was missing" fejl
  // Dette fjerner potentielle ikke-serialiserbare felter fra både user og dict
  const plainUser = JSON.parse(JSON.stringify(user));
  const plainDict = JSON.parse(JSON.stringify(dict));

  return (
    <LibraryClient 
       dict={plainDict}
       lang={locale}
       user={plainUser}
    />
  );
}