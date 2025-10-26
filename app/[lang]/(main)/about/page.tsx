"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage, Language } from '../../../../components/LanguageContext';
import React from 'react';

// Importer ikoner fra lucide-react her
import { Quote, Lightbulb, TrendingUp, Handshake } from 'lucide-react';

export default function AboutPage({
    params: paramsPromise
}: {
    params: Promise<{ lang: Language }>;
}) {
    const params = React.use(paramsPromise);
    const { lang } = params;
    const { t } = useLanguage();

    if (!t || !t.about) {
        return <div className="pt-20 text-center text-xl text-gray-700">Loading translations...</div>;
    }

    const content = t.about;

    return (
        <main className="min-h-screen bg-white">

            {/* Hero Sektion (uændret) */}
            <section className="relative flex items-center text-white py-16 sm:py-20">
                <Image
                    src="/images/about-hero-bg.jpg"
                    alt={content.title1 || "About Us"}
                    fill
                    priority
                    className="object-cover object-center z-0"
                />
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
                <div className="relative container max-w-screen-2xl mx-auto px-6 text-center z-20">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                        {content.title1}
                        <br />
                        <span className="text-orange-500">{content.title2}</span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                        {content.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* Introduktion / Citatsektion (uændret) */}
            <section className="bg-white py-16 md:py-20 text-center">
                <div className="container max-w-4xl mx-auto px-6">
                    <Quote className="mx-auto text-orange-500 w-12 h-12 mb-4" />
                    <p className="text-lg md:text-xl font-light leading-relaxed text-gray-800 italic">
                        &quot;{content.introQuote}&quot;
                    </p>
                </div>
            </section>

            {/* --- NY Missionssektion med SORT baggrund --- */}
            <section className="py-16 md:py-20 bg-black text-white">
                <div className="container max-w-screen-2xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="md:order-2">
                            <Image
                                src="/images/mission-image.jpeg"
                                alt={content.missionTitle}
                                width={700}
                                height={500}
                                className="rounded-lg shadow-2xl w-full h-auto"
                            />
                        </div>
                        <div className="space-y-6 md:order-1">
                            <h2 className="text-3xl sm:text-4xl font-bold">
                                {content.missionTitle}
                            </h2>
                            <p className="text-lg leading-relaxed text-gray-300">
                                {content.missionParagraph1}
                            </p>
                            <p className="text-lg leading-relaxed text-gray-300">
                                {content.missionParagraph2}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

{/* --- NY Værdisektion med ORANGE BOKSE, HVIDE IKONER og SORT TEKST (Dine ændringer her!) --- */}
<section className="py-16 md:py-20 bg-white">
    <div className="container max-w-screen-2xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-16">
            {content.valuesTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Værdi 1 (Orange Boks, Hvidt Ikon, Sort Tekst) */}
            <div className="group p-8 bg-orange-500 rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <Lightbulb className="mx-auto text-white w-16 h-16 mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-black mb-3">{content.value1Title}</h3>
                <p className="text-black">{content.value1Description}</p>
            </div>
            {/* Værdi 2 (Orange Boks, Hvidt Ikon, Sort Tekst) */}
            <div className="group p-8 bg-orange-500 rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <TrendingUp className="mx-auto text-white w-16 h-16 mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-black mb-3">{content.value2Title}</h3>
                <p className="text-black">{content.value2Description}</p>
            </div>
            {/* Værdi 3 (Orange Boks, Hvidt Ikon, Sort Tekst) */}
            <div className="group p-8 bg-orange-500 rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <Handshake className="mx-auto text-white w-16 h-16 mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-black mb-3">{content.value3Title}</h3>
                <p className="text-black">{content.value3Description}</p>
            </div>
        </div>
    </div>
</section>

            {/* Historie sektion (nu med SORT baggrund) */}
            <section className="py-16 md:py-20 bg-black text-white">
                <div className="container max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-12">
                        {content.historyTitle}
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-300 mx-auto">
                        {content.historyDescription}
                    </p>
                    {/* Placeholder-boksen er nu mørkere for at matche */}
                    <div className="mt-10 p-8 bg-gray-800 rounded-lg shadow-md">
                        <p className="text-gray-400 italic">
                            (Dette er et placeholder for en visuel tidslinje eller yderligere historiske detaljer. Kan bygges ud senere.)
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Sektion (uændret, da den allerede er mørk) */}
            <section className="relative py-20 md:py-28 bg-black text-white text-center overflow-hidden">
                <Image
                    src="/images/cta-bg.jpg"
                    alt={content.ctaTitle}
                    fill
                    className="object-cover opacity-100"
                />
                <div className="relative container max-w-4xl mx-auto px-6 z-10">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        {content.ctaTitle}
                    </h2>
                    <p className="text-lg md:text-xl mb-8 opacity-90">
                        {content.ctaSubtitle}
                    </p>
                    <Link
                        href={`/${lang}/signup`}
                        className="inline-block bg-orange-500 text-white font-bold px-10 py-4 rounded-lg hover:bg-orange-600 transition-colors text-lg shadow-lg"
                    >
                        {content.ctaButton}
                    </Link>
                </div>
            </section>
        </main>
    );
}