"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../../../../components/LanguageContext';

// Hjælpe-komponent til at vise en feature
const Feature = ({ title, description, points, imagePlaceholder, imageLeft = false }: { title: string; description: string; points: string[]; imagePlaceholder: string; imageLeft?: boolean; }) => (
    <div className={`grid md:grid-cols-2 gap-12 items-center`}>
        <div className={imageLeft ? 'md:order-2' : ''}>
            <div className="bg-gray-200 w-full h-80 rounded-lg shadow-lg flex items-center justify-center">
                <p className="text-gray-500">{imagePlaceholder}</p>
            </div>
        </div>
        <div className={`space-y-4 md:space-y-6 ${imageLeft ? 'md:order-1' : ''}`}>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h3>
            <p className="text-lg leading-relaxed text-gray-700">{description}</p>
            <ul className="space-y-3">
                {points.map((point, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-orange-500 mr-3 mt-1 font-bold text-xl">✓</span>
                        <span className="text-gray-700">{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


export default function FeaturesPage({
    params: paramsPromise
}: {
    params: Promise<{ lang: 'da' | 'en' }>;
}) {
    const params = React.use(paramsPromise);
    const { lang } = params;
    const { t } = useLanguage();

    if (!t || !t.featuresPage) {
        return <div className="pt-20 text-center">Loading Features...</div>;
    }

    const content = t.featuresPage;

    return (
        <main className="min-h-screen">
            {/* Hero Sektion - Stylet som dine andre sider */}
            <section className="relative py-20 sm:py-28 flex items-center text-white">
                <Image
                    src="/images/team-management.jpeg"
                    alt={content.hero.title1 || "Features"}
                    fill
                    className="object-cover object-center z-0"
                    priority
                />
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
                <div className="relative container mx-auto px-6 text-center z-20">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        {content.hero.title1}
                        <br />
                        <span className="text-orange-500">{content.hero.title2}</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">{content.hero.subtitle}</p>
                    <p className="mt-6 text-md italic text-white">"{content.hero.tagline}"</p>
                </div>
            </section>

            {/* Feature Sektioner - Bygget med din forside-struktur som skabelon */}
            <section className="py-20 bg-gray-50 text-black">
                <div className="container max-w-6xl mx-auto px-4 space-y-20 md:space-y-24">
                    
                    <Feature 
                        title={content.feature1.title} 
                        description={content.feature1.description} 
                        points={content.feature1.points}
                        imagePlaceholder="Billede af platformen"
                    />

                    <Feature 
                        title={content.feature2.title} 
                        description={content.feature2.description} 
                        points={content.feature2.points}
                        imagePlaceholder="Billede af AI-analyse"
                        imageLeft={true}
                    />

                    <Feature 
                        title={content.feature3.title} 
                        description={content.feature3.description} 
                        points={content.feature3.points}
                        imagePlaceholder="Billede af video-feedback"
                    />

                    <Feature 
                        title={content.feature4.title} 
                        description={content.feature4.description} 
                        points={content.feature4.points}
                        imagePlaceholder="Billede af spillerprofil"
                        imageLeft={true}
                    />
                    
                    <Feature 
                        title={content.feature5.title} 
                        description={content.feature5.description} 
                        points={content.feature5.points}
                        imagePlaceholder="Billede af kommunikations-hub"
                    />

                </div>
            </section>
        </main>
    );
}