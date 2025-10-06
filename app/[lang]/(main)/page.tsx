"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext';
import React from 'react'; // <-- VIGTIGT: Importér React for React.use()

// Vi modtager 'params' nu som en Promise
export default function Home({
  params: paramsPromise // <-- Navngiv det som en Promise
}: {
  params: Promise<{ lang: 'da' | 'en' }>; // <-- Type for Promise
}) {
  const params = React.use(paramsPromise); // <-- Pak params ud
  const { lang } = params; // <-- Tilgå lang fra det udpakkede objekt

  const { language, t } = useLanguage();

  if (!t) {
    return <div>Loading translations...</div>;
  }

  return (
    <>
      {/* KUNNE EVENTUELT HAVE min-h-screen, MEN INGEN pt KLASSE */}
      <main className="min-h-screen">
        {/* Hero Sektion Start - OPDATERET TIL next/image for baggrund */}
        <section className="relative h-[600px] flex items-center text-white">
          {/* Her indsætter vi Next.js Image til baggrund */}
          <Image
            src="/images/hero-bg.jpg"
            alt="En fodboldtræningsbane eller fodboldspillere på banen" // En passende og beskrivende alt-tekst
            fill // Gør billedet til at fylde den relative container (sektionen)
            className="object-cover object-center z-0" // Dækker og centrerer billedet, placerer det bagest
            priority // <-- VIGTIGT: Fortæller Next.js at preloade dette essentielle billede
          />
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div> {/* Overlay med højere z-index */}

          <div className="relative container max-w-6xl mx-auto px-4 z-20"> {/* Indhold med højeste z-index */}
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wide leading-tight">
                {t.heroTitle}
              </h1>
              <p className="mt-4 text-lg">
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
        {/* Hero Sektion Slut */}

        {/* Features Sektion Start - NY OG OPDATERET */}
        <section className="py-20 bg-gray-50 text-black"> {/* Lettere grå baggrund, øget padding */}
          <div className="container max-w-6xl mx-auto px-4">

            {/* Feature 1: Session Planning */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20 md:mb-24"> {/* Tilføjet margin-bottom */}
              <div>
                <Image
                  src="/images/session-planning.jpeg"
                  alt={t.feature1Title} // Brug den korrekte alt-tekst for tilgængelighed
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl object-cover" // RETTET: layout="responsive" objectFit="cover" erstattet med Tailwind CSS klasser
                  priority // <-- Tilføj priority her
                />
              </div>
              <div className="space-y-4 md:space-y-6"> {/* Øget space-y på desktop for mere luft */}
                <h3 className="text-2xl font-bold md:text-2xl uppercase">{t.feature1Title}</h3> {/* Større og federe overskrift på desktop */}
                <p className="text-lg leading-relaxed text-gray-700"> {/* Lidt mørkere grå tekst for bedre læsbarhed */}
                  {t.feature1Description}
                </p>
                <Link
                  href={`/${language}/features#planning`}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold text-lg md:text-xl transition-colors
                                  relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-orange-500 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  {t.feature1Link}
                </Link>
              </div>
            </div>

            {/* Feature 2: Team & Player Management */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20 md:mb-24">
              {/* Billedet skal være på højre side for denne feature på desktop */}
              <div className="md:order-2"> {/* md:order-2 flytter dette div til anden kolonne på desktop */}
                <Image
                  src="/images/team-management.jpeg"
                  alt={t.feature2Title}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl object-cover" // RETTET: layout="responsive" objectFit="cover" erstattet med Tailwind CSS klasser
                />
              </div>
              <div className="space-y-4 md:space-y-6 md:order-1"> {/* md:order-1 flytter dette div til første kolonne på desktop */}
                <h3 className="text-2xl font-bold md:text-2xl uppercase">{t.feature2Title}</h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  {t.feature2Description}
                </p>
                <Link
                  href={`/${language}/features#team`}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold text-lg md:text-xl transition-colors
                                  relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-orange-500 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  {t.feature2Link}
                </Link>
              </div>
            </div>

            {/* Feature 3: Tactical & Video Analysis */}
            <div className="grid md:grid-cols-2 gap-12 items-center"> {/* Fjernet margin-bottom her, da det er den sidste feature */}
              <div>
                <Image
                  src="/images/tactical-analysis.jpeg"
                  alt={t.feature3Title}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl object-cover" // RETTET: layout="responsive" objectFit="cover" erstattet med Tailwind CSS klasser
                />
              </div>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-2xl font-bold md:text-2xl uppercase">{t.feature3Title}</h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  {t.feature3Description}
                </p>
                <Link
                  href={`/${language}/features#analysis`}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold text-lg md:text-xl transition-colors
                                  relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-orange-500 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  {t.feature3Link}
                </Link>
              </div>
            </div>

          </div>
        </section>
        {/* Features Sektion Slut */}

        {/* CTA Sektion Start - (uændret) */}
        <section
          className="relative bg-cover bg-center py-16 md:py-20 text-white text-center"
          style={{ backgroundImage: "url('/images/cta-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-orange-600 opacity-70"></div>

          <div className="relative container max-w-4xl mx-auto px-4 z-10">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {t.ctaTitle}
            </h2>
            <p className="text-xl mb-8">
              {t.ctaSubtitle}
            </p>
            <Link
              href={`/${language}/signup`}
              className="inline-block bg-white text-orange-600 font-bold px-10 py-4 rounded-lg text-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t.ctaButton}
            </Link>
          </div>
        </section>
        {/* CTA Sektion Slut */}

      </main>
    </>
  );
}