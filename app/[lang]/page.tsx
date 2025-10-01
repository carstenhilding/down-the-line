"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../components/LanguageContext';
import React from 'react'; // <-- VIGTIGT: Importér React for React.use()

// Vi modtager 'params' nu som en Promise
export default function Home({
  params: paramsPromise // <-- Navngiv det som en Promise
}: {
  params: Promise<{ lang: 'da' | 'en' }>; // <-- Type for Promise
}) {
  // Brug React.use til at pakke Promise ud
  const params = React.use(paramsPromise); // <-- Pak params ud
  const { lang } = params; // <-- Tilgå lang fra det udpakkede objekt

  const { language, t } = useLanguage(); 

  if (!t) {
    return <div>Loading translations...</div>;
  }

  return (
    <>
      <main>
        {/* Hero Sektion Start */}
        <section className="relative h-[600px] flex items-center text-white pt-20">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>

          <div className="relative container max-w-6xl mx-auto px-4">
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wide leading-tight">
                {t.heroTitle}
              </h1>
              <p className="mt-4 text-lg">
                {t.heroSubtitle}
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-block bg-orange-500 text-white font-semibold px-8 py-3 rounded-md hover:bg-orange-600 transition-colors"
              >
                {t.heroButton}
              </Link>
            </div>
          </div>
        </section>
        {/* Hero Sektion Slut */}

        {/* Features Sektion Start */}
        <section className="bg-white py-20 text-black">
          <div className="container max-w-6xl mx-auto px-4 space-y-24">

            {/* Feature 1: Session Planning */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image src="/images/session-planning.jpeg" alt="A female football coach using a digital session planner." className="rounded-lg shadow-xl" width={600} height={400} />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">{t.feature1Title}</h3>
                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                  {t.feature1Description}
                </p>
                <Link href="/features" className="text-orange-500 font-semibold hover:underline text-lg">
                  {t.feature1Link}
                </Link>
              </div>
            </div>

            {/* Feature 2: Team & Player Management */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">{t.feature2Title}</h3>
                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                  {t.feature2Description}
                </p>
                <Link href="/features" className="text-orange-500 font-semibold hover:underline text-lg">
                  {t.feature2Link}
                </Link>
              </div>
              <div>
                <Image src="/images/team-management.jpeg" alt="A male football coach managing player data and team strategy on a computer." className="rounded-lg shadow-xl" width={600} height={400} />
              </div>
            </div>

            {/* Feature 3: Tactical & Video Analysis */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image src="/images/tactical-analysis.jpeg" alt="A male football coach analyzing game footage with tactical overlays on a large screen." className="rounded-lg shadow-xl" width={600} height={400} />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">{t.feature3Title}</h3>
                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                  {t.feature3Description}
                </p>
                <Link href="/features" className="text-orange-500 font-semibold hover:underline text-lg">
                  {t.feature3Link}
                </Link>
              </div>
            </div>

          </div>
        </section>
        {/* Features Sektion Slut */}
        {/* CTA Sektion Start */}
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
              href="/signup"
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