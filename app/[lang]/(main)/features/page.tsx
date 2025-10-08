"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../../../../components/LanguageContext';

// Hjælpe-komponent til at vise en feature-sektion
const FeatureSection = ({ title, description, points, imageSrc, imageAlt, imageLeft = false }: { title: string; description: string; points: string[]; imageSrc: string; imageAlt: string; imageLeft?: boolean; }) => (
    <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className={imageLeft ? 'md:order-2' : ''}>
            <Image
                src={imageSrc}
                alt={imageAlt}
                width={600}
                height={400}
                className="rounded-lg shadow-xl object-cover"
            />
        </div>
        <div className={`space-y-4 md:space-y-6 ${imageLeft ? 'md:order-1' : ''}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
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
        return <div className="pt-20 text-center text-xl text-gray-700">Loading Features...</div>;
    }

    const content = t.featuresPage;

    return (
        <main className="min-h-screen">
            {/* Hero Sektion */}
            <section className="relative h-[600px] flex items-center text-white">
                <Image
                    src="/images/team-management.jpeg"
                    alt={content.hero.title1 || "Features"}
                    fill
                    className="object-cover object-center z-0"
                    priority
                />
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
                <div className="relative container max-w-6xl mx-auto px-4 text-center z-20">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        {content.hero.title1}
                        <br />
                        <span className="text-orange-500">{content.hero.title2}</span>
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                        {content.hero.subtitle}
                    </p>
                    <p className="mt-6 text-md italic text-gray-300">
                        &quot;{content.hero.tagline}&quot;
                    </p>
                </div>
            </section>

            {/* Feature Sektioner */}
            <section className="py-20 bg-gray-50 text-black">
                <div className="container max-w-6xl mx-auto px-4 space-y-20 md:space-y-24">
                    
                    <FeatureSection 
                        title={content.feature1.title} 
                        description={content.feature1.description} 
                        points={content.feature1.points}
                        imageSrc="/images/placeholder-1.jpg"
                        imageAlt={content.feature1.title}
                    />

                    <FeatureSection 
                        title={content.feature2.title} 
                        description={content.feature2.description} 
                        points={content.feature2.points}
                        imageSrc="/images/placeholder-2.jpg"
                        imageAlt={content.feature2.title}
                        imageLeft={true}
                    />

                    <FeatureSection 
                        title={content.feature3.title} 
                        description={content.feature3.description} 
                        points={content.feature3.points}
                        imageSrc="/images/placeholder-3.jpg"
                        imageAlt={content.feature3.title}
                    />

                    <FeatureSection 
                        title={content.feature4.title} 
                        description={content.feature4.description} 
                        points={content.feature4.points}
                        imageSrc="/images/placeholder-4.jpg"
                        imageAlt={content.feature4.title}
                        imageLeft={true}
                    />
                    
                    <FeatureSection 
                        title={content.feature5.title} 
                        description={content.feature5.description} 
                        points={content.feature5.points}
                        imageSrc="/images/placeholder-5.jpg"
                        imageAlt={content.feature5.title}
                    />

                </div>
            </section>
        </main>
    );
}