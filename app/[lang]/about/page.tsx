"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext'; // Juster path efter behov
import React from 'react';

export default function AboutPage({
  params: paramsPromise
}: {
  params: Promise<{ lang: 'da' | 'en' }>;
}) {
  const params = React.use(paramsPromise);
  const { lang } = params;

  const { t } = useLanguage();

  if (!t) {
    return <div>Loading translations...</div>;
  }

  return (
    <>
      <main className="pt-20"> {/* pt-20 for at give plads til den faste header */}
        {/* Hero-lignende sektion for About-siden */}
        <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20 md:py-24 text-center">
          <div className="container max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t.aboutHeroTitle || "Om Down The Line"} {/* Default tekst hvis t.aboutHeroTitle ikke findes endnu */}
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              {t.aboutHeroSubtitle || "Vores historie, mission og værdier."}
            </p>
          </div>
        </section>

        {/* Missionssektion */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
              {t.aboutMissionTitle || "Vores Mission"}
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/images/mission-image.jpeg" // <--- SKAL UDSKIFTES MED ET RELEVANT BILLED
                  alt={t.aboutMissionTitle || "Fodboldhold i aktion"}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div>
                <p className="text-lg leading-relaxed text-gray-700 mb-4">
                  {t.aboutMissionParagraph1 || "Hos Down The Line er vores mission at transformere den måde, fodboldtrænere og klubber arbejder på. Vi stræber efter at levere de mest innovative værktøjer, der gør det muligt for enhver træner at maksimere sit holds potentiale og fremme spillerudvikling."}
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  {t.aboutMissionParagraph2 || "Vi tror på en fremtid, hvor alle trænere har adgang til data-drevet indsigt og effektive planlægningsværktøjer, der forenkler komplekse opgaver og frigør tid til det, der virkelig betyder noget: udvikling på banen."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Værdisektion (Eksempel) */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">
              {t.aboutValuesTitle || "Vores Værdier"}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{t.value1Title || "Innovation"}</h3>
                <p className="text-gray-600">{t.value1Description || "Vi er drevet af at udforske nye teknologier og metoder for at give dig et forspring."}</p>
              </div>
              <div className="p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{t.value2Title || "Enkelhed"}</h3>
                <p className="text-gray-600">{t.value2Description || "Komplekse data og planlægning gjort letforståeligt og brugbart for alle."}</p>
              </div>
              <div className="p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{t.value3Title || "Samarbejde"}</h3>
                <p className="text-gray-600">{t.value3Description || "Vi bygger værktøjer, der fremmer teamwork mellem trænere, spillere og ledelse."}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action sektion i bunden af About-siden */}
        <section className="py-16 bg-gray-800 text-white text-center">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.aboutCtaTitle || "Klar til at Optimere Din Træning?"}
            </h2>
            <p className="text-lg mb-8">
              {t.aboutCtaSubtitle || "Udforsk vores platform og tag dit team til næste niveau."}
            </p>
            <Link
              href="/signup"
              className="inline-block bg-orange-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t.aboutCtaButton || "Kom i Gang"}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}