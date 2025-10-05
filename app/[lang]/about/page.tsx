"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext';
import React, { use } from 'react';

export default function AboutPage({
  params: paramsPromise
}: {
  params: Promise<{ lang: 'da' | 'en' }>;
}) {
  const params = use(paramsPromise);
  const { lang } = params;

  const { t } = useLanguage();

  if (!t || !t.about || Object.keys(t.about).length === 0) {
    return <div className="pt-20 text-center text-xl text-gray-700">Loading translations...</div>;
  }

  const translations = {
    aboutHeroTitle: t.about.heroTitle || "",
    aboutHeroSubtitle: t.about.heroSubtitle || "",
    aboutIntroQuote: t.about.introQuote || "",
    aboutMissionTitle: t.about.missionTitle || "",
    aboutMissionParagraph1: t.about.missionParagraph1 || "",
    aboutMissionParagraph2: t.about.missionParagraph2 || "",
    aboutValuesTitle: t.about.valuesTitle || "",
    value1Title: t.about.value1Title || "",
    value1Description: t.about.value1Description || "",
    value2Title: t.about.value2Title || "",
    value2Description: t.about.value2Description || "",
    value3Title: t.about.value3Title || "",
    value3Description: t.about.value3Description || "",
    aboutHistoryTitle: t.about.historyTitle || "",
    aboutHistoryDescription: t.about.historyDescription || "",
    aboutCtaTitle: t.about.ctaTitle || "",
    aboutCtaSubtitle: t.about.ctaSubtitle || "",
    aboutCtaButton: t.about.ctaButton || "",
  };

  return (
    <main className="pt-20">
      
      {/* Hero Sektion for About Siden - NU MINDRE */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-16 md:py-24 overflow-hidden"> {/* py-16 og md:py-24 er reduceret */}
        <Image
          src="/images/about-hero-bg.jpg"
          alt={translations.aboutHeroTitle}
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="relative container max-w-6xl mx-auto px-4 text-center z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 animate-fade-in-up"> {/* Tekststørrelse også justeret ned */}
            {translations.aboutHeroTitle}
          </h1>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-200"> {/* Tekststørrelse også justeret ned */}
            {translations.aboutHeroSubtitle}
          </p>
        </div>
      </section>

      {/* Resten af koden forbliver uændret */}
      {/* Introduktion / Velkomst */}
      <section className="bg-white py-16 md:py-20 text-center">
        <div className="container max-w-4xl mx-auto px-4">
          <p className="text-2xl md:text-3xl font-light leading-relaxed text-gray-800 italic">
            &quot;{translations.aboutIntroQuote}&quot;
          </p>
        </div>
      </section>

      {/* Missionssektion */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <Image
                src="/images/mission-image.jpeg"
                alt={translations.aboutMissionTitle}
                width={700}
                height={500}
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-6 md:order-1">
              <h2 className="text-4xl font-bold text-gray-900">
                {translations.aboutMissionTitle}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {translations.aboutMissionParagraph1}
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                {translations.aboutMissionParagraph2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Værdisektion */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            {translations.aboutValuesTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Værdi 1: Innovation & Præcision */}
            <div className="group p-8 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-orange-500 mb-4 text-5xl">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{translations.value1Title}</h3>
              <p className="text-gray-600">{translations.value1Description}</p>
            </div>
            {/* Værdi 2: Enkelhed & Tilgængelighed */}
            <div className="group p-8 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-orange-500 mb-4 text-5xl">✨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{translations.value2Title}</h3>
              <p className="text-gray-600">{translations.value2Description}</p>
            </div>
            {/* Værdi 3: Udvikling & Samarbejde */}
            <div className="group p-8 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-orange-500 mb-4 text-5xl">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{translations.value3Title}</h3>
              <p className="text-gray-600">{translations.value3Description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vores Historie/Tidslinje sektion */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            {translations.aboutHistoryTitle}
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
            {translations.aboutHistoryDescription}
          </p>
          <div className="mt-10 p-8 bg-white rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-600 italic">
              (Dette er et placeholder for en visuel tidslinje eller yderligere historiske detaljer. Kan bygges ud senere.)
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action sektion */}
      <section className="relative py-20 md:py-28 bg-gray-900 text-white text-center overflow-hidden">
        <Image
          src="/images/cta-bg.jpg"
          alt={translations.aboutCtaTitle}
          fill
          className="object-cover opacity-50"
        />
        <div className="relative container max-w-4xl mx-auto px-4 z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {translations.aboutCtaTitle}
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {translations.aboutCtaSubtitle}
          </p>
          <Link
            href="/signup"
            className="inline-block bg-orange-500 text-white font-bold px-10 py-4 rounded-lg hover:bg-orange-600 transition-colors text-lg shadow-lg"
          >
            {translations.aboutCtaButton}
          </Link>
        </div>
      </section>

    </main>
  );
}