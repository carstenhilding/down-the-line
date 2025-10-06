"use client";

import { useLanguage } from '../../../components/LanguageContext'; // Korrekt sti til LanguageContext
import { use } from 'react'; // Importer 'use' for Promise-håndtering

export default function DashboardPage({
  params: paramsPromise
}: {
  params: Promise<{ lang: 'da' | 'en' }>;
}) {
  const params = use(paramsPromise);
  const { lang } = params;
  const { t } = useLanguage();

  if (!t) {
    return <div className="pt-20 text-center text-xl text-gray-700">Loading translations...</div>;
  }

  return (
    <main className="min-h-[calc(100vh-76px)] flex flex-col items-center justify-center bg-gray-50 p-8 pt-[76px]">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {lang === 'da' ? 'Velkommen til dit Dashboard!' : 'Welcome to your Dashboard!'}
      </h1>
      <p className="text-lg text-gray-700">
        {lang === 'da' ? 'Dette er din personlige arbejdsflade. Herfra kan du administrere hold, planlægge træning og analysere data.' : 'This is your personal workspace. From here you can manage teams, plan training, and analyze data.'}
      </p>
      <p className="mt-4 text-gray-500">
        {lang === 'da' ? 'Funktionalitet vil blive bygget ud her.' : 'Functionality will be built out here.'}
      </p>
    </main>
  );
}