"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext';
import React from 'react';

export default function Home({
  params: paramsPromise
}: {
  params: Promise<{ lang: 'da' | 'en' }>;
}) {
  const params = React.use(paramsPromise);
  const { lang } = params; 
  const { language, t } = useLanguage();

  if (!t) {
    return <div>Loading translations...</div>;
  }

  return (
    <>
      <main className="min-h-screen">
        {/* Hero Sektion */}
        <section className="relative h-[600px] flex items-center text-white">
          <Image
            src="/images/hero-bg.jpg"
            alt="En fodboldtræningsbane"
            fill
            className="object-cover object-center z-0"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
          {/* OPDATERET: max-w-screen-2xl for at matche header */}
          <div className="relative container max-w-screen-2xl mx-auto px-6 z-20">
            <div className="w-full lg:w-2/3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide leading-tight">
                {t.heroTitle}
              </h1>
              <p className="mt-4 text-base sm:text-lg lg:text-xl">
                {t.heroSubtitle}
              </p>
              <Link
                href={`/${language}/signup`}
                className="mt-8 inline-block bg-orange-500 text-white font-semibold px-8 py-3 rounded-md hover:bg-orange-600 transition-colors"
              >
                {t.heroButton}
              </Link>
            </div>
          </div>
        </section>

        {/* Features Sektion */}
        <section className="py-20 bg-gray-50 text-black">
          {/* OPDATERET: max-w-screen-2xl for at matche header */}
          <div className="container max-w-screen-2xl mx-auto px-6">

            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20 md:mb-24">
              <div>
                <Image
                  src="/images/session-planning.jpeg"
                  alt={t.feature1Title}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl object-cover w-full h-auto"
                />
              </div>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-2xl font-bold uppercase">{t.feature1Title}</h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  {t.feature1Description}
                </p>
                <Link
                  href={`/${language}/features#planning`}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold text-lg transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-orange-500 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  {t.feature1Link}
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20 md:mb-24">
              <div className="md:order-2">
                <Image
                  src="/images/team-management.jpeg"
                  alt={t.feature2Title}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl object-cover w-full h-auto"
                />
              </div>
              <div className="space-y-4 md:space-y-6 md:order-1">
                <h3 className="text-2xl font-bold uppercase">{t.feature2Title}</h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  {t.feature2Description}
                </p>
                <Link
                  href={`/${language}/features#team`}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold text-lg transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-orange-500 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  {t.feature2Link}
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/images/tactical-analysis.jpeg"
                  alt={t.feature3Title}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl object-cover w-full h-auto"
                />
              </div>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-2xl font-bold uppercase">{t.feature3Title}</h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  {t.feature3Description}
                </p>
                <Link
                  href={`/${language}/features#analysis`}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold text-lg transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-orange-500 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  {t.feature3Link}
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* CTA Sektion */}
        <section
          className="relative bg-cover bg-center py-16 md:py-20 text-white text-center"
          style={{ backgroundImage: "url('/images/cta-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-orange-600 opacity-70"></div>
          <div className="relative container max-w-4xl mx-auto px-6 z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
              {t.ctaTitle}
            </h2>
            <p className="text-lg sm:text-xl mb-8">
              {t.ctaSubtitle}
            </p>
            <Link
              href={`/${language}/signup`}
              className="inline-block bg-white text-orange-600 font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-lg sm:text-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t.ctaButton}
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}