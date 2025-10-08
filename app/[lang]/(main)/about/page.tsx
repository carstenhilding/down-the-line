"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../../../components/LanguageContext';
import React, { use } from 'react'; // Importer 'use'

// Importer ikoner fra lucide-react her
import { Quote, Lightbulb, TrendingUp, Handshake } from 'lucide-react';

export default function AboutPage({
  params: paramsPromise
}: {
  params: Promise<{ lang: 'da' | 'en' }>;
}) {
  const params = use(paramsPromise); // Brug 'use' hook her
  const { lang } = params;

  const { t } = useLanguage();

  if (!t || !t.about || Object.keys(t.about).length === 0) {
    return <div className="pt-20 text-center text-xl text-gray-700">Loading translations...</div>;
  }

  // --- ÆNDRING 1: Henter de to nye titler fra i18n ---
  const translations = {
    aboutTitle1: t.about.title1 || "", // Rettet fra aboutHeroTitle
    aboutTitle2: t.about.title2 || "", // Tilføjet
    aboutHeroSubtitle: t.about.heroSubtitle || "",
    fintroduction: t.about.introQuote || "",
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
    <main>

      {/* Hero Sektion for About Siden */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-16 md:py-24 overflow-hidden">
        <Image
          src="/images/about-hero-bg.jpg"
          alt={translations.aboutTitle1} // Opdateret alt-tekst
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-30"></div>
        <div className="relative container max-w-6xl mx-auto px-4 text-center z-10">
          {/* --- ÆNDRING 2: Opdaterer H1-tagget --- */}
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 animate-fade-in-up">
            {translations.aboutTitle1}
            <br />
            <span className="text-orange-500">{translations.aboutTitle2}</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-200">
            {translations.aboutHeroSubtitle}
          </p>
        </div>
      </section>

      {/* Resten af din originale kode er URØRT herfra... */}
      
      {/* Introduktion / Velkomst (Citatsektion) */}
      <section className="bg-white py-10 md:py-12 text-center">
        <div className="container max-w-2xl mx-auto px-4">
          <Quote className="mx-auto text-orange-500 w-10 h-10 mb-3" />
          <p className="text-lg md:text-xl font-light leading-relaxed text-gray-800 italic">
            &quot;{translations.aboutIntroQuote}&quot;
          </p>
        </div>
      </section>

      {/* Missionssektion */}
      <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-200">
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

      {/* Værdisektion - NU MED ORANGE BOKSE, HVID TEKST OG IKONER */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            {translations.aboutValuesTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Værdi 1: Innovation & Præcision */}
            <div className="group p-8 border-none rounded-lg shadow-md bg-orange-500 text-white
                           hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
              <Lightbulb className="mx-auto text-white w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-3">{translations.value1Title}</h3>
              <p className="opacity-90">{translations.value1Description}</p>
            </div>
            {/* Værdi 2: Enkelhed & Tilgængelighed */}
            <div className="group p-8 border-none rounded-lg shadow-md bg-orange-500 text-white
                           hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
              <TrendingUp className="mx-auto text-white w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-3">{translations.value2Title}</h3>
              <p className="opacity-90">{translations.value2Description}</p>
            </div>
            {/* Værdi 3: Udvikling & Samarbejde */}
            <div className="group p-8 border-none rounded-lg shadow-md bg-orange-500 text-white
                           hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
              <Handshake className="mx-auto text-white w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-3">{translations.value3Title}</h3>
              <p className="opacity-90">{translations.value3Description}</p>
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
            href={`/${lang}/signup`}
            className="inline-block bg-orange-500 text-white font-bold px-10 py-4 rounded-lg hover:bg-orange-600 transition-colors text-lg shadow-lg"
          >
            {translations.aboutCtaButton}
          </Link>
        </div>
      </section>

    </main>
  );
}