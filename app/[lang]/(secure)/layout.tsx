// app/[lang]/(secure)/layout.tsx (FINAL KORREKTION V8: await params FØRST)

import { notFound } from 'next/navigation';
import { fetchSecureTranslations } from '@/i18n/getSecurePageTranslations';
import { fetchUserAccessLevel, UserRole } from '@/lib/server/data';
import SecureLayoutClient from '@/components/SecureLayoutClient'; // Sørg for stien er korrekt
import { Language } from '@/components/LanguageContext';
import validateLang from '@/lib/lang';
// NY: Vi importerer UserProvider for at kunne styre niveauer globalt
import { UserProvider } from '@/components/UserContext';

interface SecureLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

// NOTE: params modtages som et objekt, IKKE et Promise ifølge typen.
// Vi prøver at tilgå det efter en "pseudo-await" for at se om det løser fejlen.
export default async function SecureLayout({ children, params }: SecureLayoutProps) {

  // KORREKTION: Tilgår params *allerførst* — await params before using its properties
  const { lang } = await params; // params is a Promise<{ lang: Language }>
  const locale = validateLang(lang);

  // 1. SIKKERHEDSCHECK & DATA HENTNING
  const user = await fetchUserAccessLevel();

  if (user.role === UserRole.Unauthenticated) {
    return notFound(); // Bloker adgang
  }

  // Bruger 'lang' som blev læst FØR await
  const dict = await fetchSecureTranslations(locale);

  // Placeholder for initialPathname
  const initialPathname = `/${locale}/dashboard`; // MIDLERTIDIG PLACEHOLDER


  // 2. RENDERING AF CLIENT COMPONENT
  return (
    // VI WRAPPER DET HELE I USERPROVIDER HER, så hele appen kender brugerens niveau:
    <UserProvider initialUser={user}>
        <SecureLayoutClient
        user={user}
        dict={dict}
        lang={locale}
        initialPathname={initialPathname}
        >
            {children}
        </SecureLayoutClient>
    </UserProvider>
  );
}