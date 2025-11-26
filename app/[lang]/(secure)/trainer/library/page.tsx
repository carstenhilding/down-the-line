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

  // 1. Adgangskontrol (Samme mønster som i Trainer Hub)
  const user = await fetchUserAccessLevel();
  if (user.role === UserRole.Unauthenticated) {
    return notFound();
  }

  // 2. Hent oversættelser (Inkl. den nye 'library' del)
  const dict = await fetchSecureTranslations(locale);

  return (
    <LibraryClient 
       dict={dict}
       lang={locale}
       user={user}
    />
  );
}