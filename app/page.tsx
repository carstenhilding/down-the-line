"use client"; // page.tsx skal også være en Client Component for at bruge useLanguage

import { useLanguage } from '../components/LanguageContext'; // <-- Importer useLanguage
import Footer from '../components/Footer'; // <-- Din Footer import

export default function Home() {
  const { t } = useLanguage(); // Brug useLanguage hook til at få oversættelsesteksterne

  return (
    <> {/* <-- START ET FRAGMENT HER */}
      <main>
        {/* Hero Sektion Start */}
        <section className="relative h-[600px] flex items-center text-white">
          {/* Baggrundsbillede med mørkt filter */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>

          {/* Indhold */}
          <div className="relative container max-w-6xl mx-auto px-4">
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wide leading-tight">
                {t.heroTitle}
              </h1>
              <p className="mt-4 text-lg">
                {t.heroSubtitle}
              </p>
              <a
                href="#"
                className="mt-8 inline-block bg-orange-500 text-white font-semibold px-8 py-3 rounded-md hover:bg-orange-600 transition-colors"
              >
                {t.heroButton}
              </a>
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
                <img src="/images/session-planning.jpeg" alt="A female football coach using a digital session planner." className="rounded-lg shadow-xl"/>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">{t.feature1Title}</h3>
                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                  {t.feature1Description}
                </p>
                <a href="#" className="text-orange-500 font-semibold hover:underline text-lg">
                  {t.feature1Link}
                </a>
              </div>
            </div>

            {/* Feature 2: Team & Player Management */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">{t.feature2Title}</h3>
                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                  {t.feature2Description}
                </p>
                <a href="#" className="text-orange-500 font-semibold hover:underline text-lg">
                  {t.feature2Link}
                </a>
              </div>
              <div>
                <img src="/images/team-management.jpeg" alt="A male football coach managing player data and team strategy on a computer." className="rounded-lg shadow-xl"/>
              </div>
            </div>

            {/* Feature 3: Tactical & Video Analysis */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img src="/images/tactical-analysis.jpeg" alt="A male football coach analyzing game footage with tactical overlays on a large screen." className="rounded-lg shadow-xl"/>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">{t.feature3Title}</h3>
                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                  {t.feature3Description}
                </p>
                <a href="#" className="text-orange-500 font-semibold hover:underline text-lg">
                  {t.feature3Link}
                </a>
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
          {/* Orange farveoverlay for bedre læsbarhed af tekst */}
          <div className="absolute inset-0 bg-orange-600 opacity-70"></div> 
          
          <div className="relative container max-w-4xl mx-auto px-4 z-10">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {t.ctaTitle}
            </h2>
            <p className="text-xl mb-8">
              {t.ctaSubtitle}
            </p>
            <a
              href="#"
              className="inline-block bg-white text-orange-600 font-bold px-10 py-4 rounded-lg text-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t.ctaButton}
            </a>
          </div>
        </section>
        {/* CTA Sektion Slut */}
      </main> {/* <-- HER SLUTTER MAIN */}
      <Footer /> {/* <-- Footer er nu inden for fragmentet */}
    </> 
  );
}